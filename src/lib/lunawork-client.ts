import { Client, ClientOptions, Message, Intents } from 'discord.js'
import { CommandManager } from './command/command-manager'
import { CommandParserStage } from './command/command-parser'
import { ArgTypes } from './utils/arg-type-provider'
import { ListenerManager } from './listener/listener-manager'
import { Stage } from './stage'
import { ILogger, Logger, LogLevel } from './logger/logger'
import { Awaited } from './types'
import { WebsocketManager } from './websocket/websocket-manager'

/**
 * A valid prefix in Lunawork:
 *  * `string`: a single prefix, e.g. `'!'`
 *  * `Array<string>`: an array of prefixes, e.g. `['!', '.']`.
 *  * `null`: disabled prefix, locks the bot's command usage to mentions only.
 */
export type LunaworkPrefix = string | Array<string> | null

export interface ILunaworkPrefixHook {
  (message: Message): Awaited<LunaworkPrefix>
}

interface ILunaworkClientOptions {
  commandArgumentTypes?: ArgTypes

  /**
   * The default prefix, in case of `null`, only mention prefix will trigger the bot's commands.
   * @default null
   */
  defaultPrefix?: LunaworkPrefix

  /**
   * The prefix hook, by default it is a callback function that returns [[ILunaworkClientOptions.defaultPrefix]].
   * @default () => client.options.defaultPrefix
   */
  fetchPrefix?: ILunaworkPrefixHook

  /**
   * The logger options, defaults to an instance of Logger when instance is not specified.
   */
  logger?: IClientLoggerOptions
}

/**
 * The base [[Client]] extension that makes Lunawork work. When building a Discord bot with the framework, the developer
 * must either use this class, or extend it.
 *
 * @example
 * ```typescript
 * const client = new LunaworkClient({
 *   presence: {
 *    activities: [
 *      {
 *        name: 'for commands!',
 *        type: 'LISTENING',
 *      },
 *    ],
 *  },
 * })
 *
 * client.login(process.env.DISCORD_TOKEN)
 *   .catch(console.error)
 * ```
 */
export class LunaworkClient extends Client {
  public commandManager: CommandManager
  public webSocketManager: WebsocketManager
  public listenerManager: ListenerManager
  public stages: Set<Stage> = new Set()

  /**
   * This method to be overriden by the developer.
   * @return A string for a single prefix, an array of strings for matching multiple, or null
   *         for no match (mention prefix only).
   *
   * @example
   * ```typescript
   * // Return always the same prefix (unconfigurable):
   * client.fetchPrefix = () => '!';
   * ```
   *
   * @example
   * ```typescript
   * // Retrieving the prefix from a SQL database:
   * client.fetchPrefix = async (message) => {
   *   // note: driver is something generic and depends on how you connect to your database
   *   const guild = await driver.getOne('SELECT prefix FROM public.guild WHERE id = $1', [message.guild.id])
   *   return guild.prefix ?? '!'
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Retrieving the prefix from an ORM:
   * client.fetchPrefix = async (message) => {
   *   // note: driver is something generic and depends on how you connect to your database
   *   const guild = await driver.getRepository(GuildEntity).findOne({ id: message.guild.id })
   *   return guild?.prefix ?? '!'
   * }
   * ```
   */
  public fetchPrefix: ILunaworkPrefixHook

  /**
   * The logger to be used by the framework. By default, a [[Logger]] instance is used, which emits the
   * messages to the console.
   */
  public logger: ILogger

  readonly commandArgumentTypes: ArgTypes

  constructor(options: ClientOptions = { intents: Intents.NON_PRIVILEGED }) {
    super(options)

    this.commandManager = new CommandManager()
    this.webSocketManager = new WebsocketManager(this)
    this.listenerManager = new ListenerManager(this)
    this.commandArgumentTypes = options.commandArgumentTypes || {}

    this.logger =
      options.logger?.instance ??
      new Logger(options.logger?.level ?? LogLevel.Info)

    this.fetchPrefix =
      options.fetchPrefix ?? (() => this.options.defaultPrefix ?? null)

    this.registerStage(CommandParserStage)
  }

  public registerStage(stage: typeof Stage | Stage) {
    if (stage === Stage || stage instanceof Stage) {
      throw new TypeError(
        'registerStage only takes in classes that extend Stage',
      )
    }

    if (
      Array.from(this.stages).some(
        (m) =>
          m.constructor.name === stage.name ||
          m.constructor.name === stage.constructor.name,
      )
    ) {
      throw new Error(
        `cannot register multiple stages with same name (${
          stage.name || stage.constructor.name
        })`,
      )
    }

    const mod = stage instanceof Stage ? stage : new stage(this)
    this.registerStageInstance(mod)
    return this
  }

  private registerStageInstance(instance: Stage) {
    if (!(instance instanceof Stage)) {
      throw new TypeError(
        'registerStageInstance only takes in instances of Stage',
      )
    }
    if (
      Array.from(this.stages).some(
        (m) => m.constructor.name === instance.constructor.name,
      )
    ) {
      throw new Error(
        `cannot register multiple modules with same name (${instance.constructor.name})`,
      )
    }

    instance.processListeners
      .bind(instance)()
      .forEach((listener) => this.listenerManager.add(listener))
    instance.processWebSockets
      .bind(instance)()
      .forEach((wsListener) => this.webSocketManager.add(wsListener))
    instance.processCommands
      .bind(instance)()
      .forEach((command) => this.commandManager.add(command))

    this.stages.add(instance)
    return this
  }
}

export interface IClientLoggerOptions {
  level?: LogLevel
  instance?: ILogger
}

declare module 'discord.js' {
  // eslint-disable-next-line
  interface Client {
    logger: ILogger
    fetchPrefix: ILunaworkPrefixHook
  }

  // eslint-disable-next-line
  interface ClientOptions extends ILunaworkClientOptions {}
}
