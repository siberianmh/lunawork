import { ButtonInteraction } from 'discord.js'
import { Stage } from '../core/stage'
import { buttonMetaKey } from '../lib/reflect-prefixes'

export interface IButtonDecoratorOptions {
  readonly customID: string
  readonly onError?: (msg: ButtonInteraction, error: Error) => void
}

interface IButtonDecoratorMeta {
  readonly id: string
}

export type IButtonDecorator = IButtonDecoratorMeta & IButtonDecoratorOptions

export function button(opts: IButtonDecoratorOptions) {
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

    const meta: IButtonDecorator = {
      id: propertyKey,
      customID: opts.customID,
      onError:
        opts.onError ||
        ((msg) =>
          msg.reply({
            content: ':warning: error while executing the command',
          })),
    }

    const targetMetas: Array<IButtonDecorator> =
      Reflect.getMetadata(buttonMetaKey, target) || []
    targetMetas.push(meta)
    Reflect.defineMetadata(buttonMetaKey, targetMetas, target)
  }
}
