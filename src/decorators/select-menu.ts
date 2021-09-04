import { SelectMenuInteraction } from 'discord.js'
import { Inhibitor } from '../lib/inhibitors'
import { Stage } from '../core/stage'
import { selectMenuMetaKey } from '../lib/reflect-prefixes'

export interface ISelectMenuDecoratorOptions {
  readonly customID: string
  readonly inhibitors?: Array<Inhibitor>
  readonly onErorr?: (msg: SelectMenuInteraction, error: Error) => void
}

interface ISelectMenuDecoratorMeta {
  readonly id: string
}

export type ISelectMenuDecorator = ISelectMenuDecoratorMeta &
  ISelectMenuDecoratorOptions

export function selectMenu(opts: ISelectMenuDecoratorOptions) {
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

    const meta: ISelectMenuDecorator = {
      id: propertyKey,
      customID: opts.customID,
      inhibitors: opts.inhibitors || [],
      onErorr:
        opts.onErorr ||
        ((msg) =>
          msg.reply({
            content: ':warning: error while executing the command',
          })),
    }

    const targetMetas: Array<ISelectMenuDecorator> =
      Reflect.getMetadata(selectMenuMetaKey, target) || []
    targetMetas.push(meta)
    Reflect.defineMetadata(selectMenuMetaKey, targetMetas, target)
  }
}
