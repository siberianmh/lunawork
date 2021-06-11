import { Message } from 'discord.js'
import { Stage } from '../../stage'
import { Context } from '../../utils/context'
import { commandMetas, optionalCommandArgs } from '../../utils/reflect-prefixes'
import { Inhibitor } from '../inhibitors'

export interface IPrefixCommanDecoratorOptions {
  readonly single: boolean
  readonly inhibitors: Array<Inhibitor>
  readonly onError: (msg: Message, error: Error) => void
  readonly description: string | undefined
  readonly usesContextAPI: boolean
  readonly aliases: Array<string>
}

export interface ICommandArgument {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: Function
  optional: boolean
}

interface IPrefixCommandDecoratorMeta {
  readonly id: string
  readonly args: Array<ICommandArgument>
}

export type IPrefixCommandDecorator = IPrefixCommandDecoratorMeta &
  IPrefixCommanDecoratorOptions

export function command(
  opts: Partial<IPrefixCommanDecoratorOptions> | undefined = {},
): (
  target: Stage,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => void {
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

    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Array<Function> = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey,
    )

    // Optional args stuff
    const optionals: Array<number> =
      Reflect.getMetadata(optionalCommandArgs, target, propertyKey) || []
    if (optionals.includes(0)) {
      throw new Error('The fisrt argument may not be optional')
    }
    let lastOpt: number = optionals[0] + 1
    for (const x of optionals) {
      if (lastOpt - x !== 1) {
        throw new Error('Only the last arguments can be optional')
      }
      lastOpt = x
    }

    const newMeta: IPrefixCommandDecorator = {
      aliases: opts.aliases || [],
      description: opts.description,
      id: propertyKey,
      args: types.slice(1).map((type, i) => ({
        type,
        optional: optionals.includes(i + 1),
      })),
      single: opts.single || false,
      inhibitors: opts.inhibitors || [],
      usesContextAPI: types[0] === Context,
      onError:
        opts.onError ||
        ((msg) => {
          msg.channel.send({
            content: ':warning: error while executing command!',
          })
        }),
    }

    if (
      newMeta.single &&
      (newMeta.args.length !== 1 || newMeta.args[0].type !== String)
    ) {
      throw new Error(
        `${target.constructor.name}/${newMeta.id}: single arg commands can only take in one string`,
      )
    }

    const targetMetas: Array<IPrefixCommandDecorator> =
      Reflect.getMetadata(commandMetas, target) || []
    targetMetas.push(newMeta)
    Reflect.defineMetadata(commandMetas, targetMetas, target)
  }
}
