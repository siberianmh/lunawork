import { Stage } from '../../stage'
import { optionalCommandArgs } from '../../utils/reflect-prefixes'

export function optional(
  target: Record<string, unknown>,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  if (!(target instanceof Stage)) {
    throw new TypeError(`${target.constructor.name} doesn't extend Stage`)
  }

  const descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey)
  if (!(descriptor?.value.constructor instanceof Function)) {
    throw new TypeError(
      `Decorator needs to be applied to a Method. (${target.constructor.name}#${descriptor?.value.name} was ${descriptor?.value.constructor.name})`,
    )
  }

  const arr: Array<number> =
    Reflect.getMetadata(optionalCommandArgs, target, propertyKey) || []
  arr.push(parameterIndex)

  Reflect.defineMetadata(optionalCommandArgs, arr, target, propertyKey)
}
