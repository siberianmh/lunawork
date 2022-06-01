import { ModalSubmitInteraction } from 'discord.js'
import { Stage } from '../core/stage'
import { Inhibitor } from '../lib/inhibitors'
import { modalMetaKey } from '../lib/reflect-prefixes'

export interface IModalDecoratorOptions {
  readonly customID: string
  readonly inhibitors?: Array<Inhibitor>
  readonly onError?: (msg: ModalSubmitInteraction, error: Error) => void
}

interface IModalDecoratorMeta {
  readonly id: string
}

export type IModalDecorator = IModalDecoratorMeta & IModalDecoratorOptions

export function modal(opts: IModalDecoratorOptions) {
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

    const meta: IModalDecorator = {
      id: propertyKey,
      customID: opts.customID,
      inhibitors: opts.inhibitors || [],
      onError:
        opts.onError ||
        ((msg) =>
          msg.reply({
            content: ':warning: error while exeucting the command',
          })),
    }

    const targetMetas: Array<IModalDecorator> =
      Reflect.getMetadata(modalMetaKey, target) || []
    targetMetas.push(meta)
    Reflect.defineMetadata(modalMetaKey, targetMetas, target)
  }
}
