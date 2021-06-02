import { CommandInteraction } from 'discord.js'
import { Stage } from '../../stage'
import { slashCommandMetas } from '../../utils/reflect-prefixes'
import { ISlashCommand } from '../command'
import { Inhibitor } from '../inhibitors'

export interface ICommandDecoratorOptions {
  readonly description: string

  readonly inhibitors?: Array<Inhibitor>
  readonly onError?: (msg: CommandInteraction, error: Error) => void
  readonly usesContextAPI?: boolean
}

type ICommandDecoratorMeta = Pick<ISlashCommand, 'id' | 'usesContextAPI'>
export type ICommandDecorator = ICommandDecoratorMeta & ICommandDecoratorOptions

export function slashCommand(opts: ICommandDecoratorOptions) {
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

    const newMeta: ICommandDecorator = {
      description: opts.description || '',
      id: propertyKey,
      inhibitors: opts.inhibitors || [],
      onError:
        opts.onError ||
        ((msg) => msg.reply(':warning: error while executing the command')),
      usesContextAPI: false,
    }

    const targetMetas: Array<ICommandDecorator> =
      Reflect.getMetadata(slashCommandMetas, target) || []
    targetMetas.push(newMeta)
    Reflect.defineMetadata(slashCommandMetas, targetMetas, target)
  }
}
