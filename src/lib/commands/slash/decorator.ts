import { CommandInteraction, ApplicationCommandData } from 'discord.js'
import { Stage } from '../../stage'
import { slashCommandMetas } from '../../utils/reflect-prefixes'
import { Inhibitor } from '../inhibitors'

export interface ISlashCommandDecoratorOptions
  extends Partial<ApplicationCommandData> {
  readonly description: string

  readonly inhibitors?: Array<Inhibitor>
  readonly onError?: (msg: CommandInteraction, error: Error) => void
  readonly usesContextAPI?: boolean
}

interface ISlashCommandDecoratorMeta {
  readonly id: string
}

export type ISlashCommandDecorator = ISlashCommandDecoratorMeta &
  ISlashCommandDecoratorOptions

export function slashCommand(opts: ISlashCommandDecoratorOptions) {
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

    const newMeta: ISlashCommandDecorator = {
      name: opts.name || '',
      description: opts.description || '',
      id: propertyKey,
      inhibitors: opts.inhibitors || [],
      options: opts.options || [],
      onError:
        opts.onError ||
        ((msg) => msg.reply(':warning: error while executing the command')),
      usesContextAPI: false,
    }

    const targetMetas: Array<ISlashCommandDecorator> =
      Reflect.getMetadata(slashCommandMetas, target) || []
    targetMetas.push(newMeta)
    Reflect.defineMetadata(slashCommandMetas, targetMetas, target)
  }
}
