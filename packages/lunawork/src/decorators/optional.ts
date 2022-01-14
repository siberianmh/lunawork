import { Stage } from '../core/stage'
import { optionalMetaKey } from '../lib/reflect-prefixes'

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
    Reflect.getMetadata(optionalMetaKey, target, propertyKey) || []
  arr.push(parameterIndex)

  Reflect.defineMetadata(optionalMetaKey, arr, target, propertyKey)
}
