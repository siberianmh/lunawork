import type {
  CommandInteraction,
  ApplicationCommandOptionData,
} from 'discord.js'
import type { APIApplicationCommandOption } from 'discord-api-types/v9'
import { Stage } from '../core/stage'
import { applicationCommandMetaKey } from '../lib/reflect-prefixes'
import { Inhibitor } from '../lib/inhibitors'

export interface IApplicationCommandDecoratorOptions {
  readonly name?: string
  readonly description?: string
  readonly type?: 'CHAT_INPUT' | 'MESSAGE' | 'USER'
  readonly options?:
    | Array<APIApplicationCommandOption>
    | Array<ApplicationCommandOptionData>

  readonly inhibitors?: Array<Inhibitor>
  readonly onError?: (msg: CommandInteraction, error: Error) => void
}

interface IApplicationCommandDecoratorMeta {
  readonly id: string
}

export type IApplicationCommandDecorator = IApplicationCommandDecoratorMeta &
  IApplicationCommandDecoratorOptions

export function applicationCommand(opts: IApplicationCommandDecoratorOptions) {
  return function (
    target: Stage,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const targetConstructorName = target.constructor.name
    if (!(target instanceof Stage)) {
      throw new TypeError(`${targetConstructorName} doesn't extend Stage`)
    }

    if (!(descriptor.value.constructor instanceof Function)) {
      throw new TypeError(
        `Decorator needs to be applied to a Method. (${targetConstructorName}#${descriptor.value.name} was ${descriptor.value.constructor.name})`,
      )
    }

    const newMeta: IApplicationCommandDecorator = {
      name: opts.name || '',
      description: opts.description || '',
      id: propertyKey,
      inhibitors: opts.inhibitors || [],
      options: opts.options || undefined,
      type: opts.type || 'CHAT_INPUT',
      onError:
        opts.onError ||
        ((msg) =>
          msg.reply({
            content: ':warning: error while executing the command',
          })),
    }

    const targetMeta: Array<IApplicationCommandDecorator> =
      Reflect.getMetadata(applicationCommandMetaKey, target) || []
    targetMeta.push(newMeta)
    Reflect.defineMetadata(applicationCommandMetaKey, targetMeta, target)
  }
}

/**
 * @deprecated use `applicationCommand(opts)` instead
 */
export function slashCommand(opts: IApplicationCommandDecoratorOptions) {
  return function (
    target: Stage,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return applicationCommand(opts)(target, propertyKey, descriptor)
  }
}
