import { Client, ClientOptions, Message, GatewayIntentBits } from 'discord.js'

import type { IExperimentalOptions } from '../lib/types'
import { Stage } from './stage'
import { ExecutorStage } from './executor'
import { Manager, ApplicationCommandManager } from './manager'

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
  /**
   * A set of the experimental options.
   * The usage can be changed at any time. Use at own risk
   */
  experimental?: Partial<IExperimentalOptions>

  /**
   * Register the Slash commands automatically.
   *
   * Defaults to `true`
   */
  manageApplicationCommands?: boolean

  /**
   * The default prefix.
   *
   * Defaults to `null`
   */
  defaultPrefix?: LunaworkPrefix

  /**
   * The prefix hook, by default it is a callback function that returns {@link ILunaworkClientOptions.defaultPrefix}
   *
   * Defaults to `() => client.options.defaultPrefix`
   */
  fetchPrefix?: ILunaworkPrefixHook
}

/**
 * The base {@link Client} extension that creates Lunawork.
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
  public manager: Manager
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

  public constructor(
    options: ClientOptions = {
      intents: GatewayIntentBits.Guilds,
    },
  ) {
    super(options)

    this.manager = new Manager(this)

    this.fetchPrefix =
      options.fetchPrefix ?? (() => this.options.defaultPrefix ?? null)

    this.registerStage(ExecutorStage)
  }

  public registerStages(stages: Array<typeof Stage | Stage>) {
    for (const stage of stages) {
      this.registerStage(stage)
    }
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
        'registerStageInstance only takes in instance of Stage',
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

    const {
      selectMenus,
      buttons,
      prefixCommands,
      listeners,
      wsListeners,
      applicationCommands,
    } = instance.process.bind(instance)()

    this.manager.registerListeners(listeners)
    this.manager.registerWebSocketListeners(wsListeners)
    this.manager.registerApplicationCommands(applicationCommands)
    this.manager.registerPrefixCommands(prefixCommands)
    this.manager.registerButtons(buttons)
    this.manager.registerSelectMenus(selectMenus)

    this.stages.add(instance)
    return this
  }

  /**
   * Loads the internal API requester, and then login using d.js
   */
  public async login(token?: string) {
    const login = await super.login(token)

    // We relay on the real user!
    const manageCommands = this.options.manageApplicationCommands ?? true

    if (manageCommands) {
      this.registerStage(ApplicationCommandManager)
    }

    return login
  }
}

declare module 'discord.js' {
  // eslint-disable-next-line
  interface Client {
    fetchPrefix: ILunaworkPrefixHook
  }

  // eslint-disable-next-line
  interface ClientOptions extends ILunaworkClientOptions {}
}
