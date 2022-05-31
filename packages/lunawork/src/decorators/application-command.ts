import {
  IApplicationCommandDecoratorOptions,
  IApplicationCommandDecoratorMeta,
  ApplicationCommandTypes,
} from '../lib/types'
import { Stage } from '../core/stage'
import { applicationCommandMetaKey } from '../lib/reflect-prefixes'

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
      name: opts.name,
      description: opts.description || '',
      id: propertyKey,
      inhibitors: opts.inhibitors || [],
      options: opts.options || undefined,
      type: opts.type || ApplicationCommandTypes.CHAT_INPUT,
      disabled: opts.disabled || false,
      onAutocomplete: opts.onAutocomplete || undefined,
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
