import { Stage } from '../stage'
import { Event } from '../types/events'
import { listenerMetas } from '../utils/reflect-prefixes'

export interface IListenerDecoratorOptions {
  event: Event
}

export interface IListenerDecoratorMeta {
  readonly event: Event
  readonly id: string
  readonly func: (...args: Array<any>) => void
}

export function listener(opts: IListenerDecoratorOptions) {
  return function (
    target: Stage,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const targetConstructorName = target.constructor.name // Making this a variable to avoid some weird TS bug.

    if (!(target instanceof Stage)) {
      throw new TypeError(`${targetConstructorName} doesn't extend Stage`)
    }

    if (!(descriptor.value.constructor instanceof Function)) {
      throw new TypeError(
        `Decorator needs to be applied to a Method. (${target.constructor.name}#${descriptor.value.name} was ${descriptor.value.constructor.name})`,
      )
    }

    const listenersMeta: Array<IListenerDecoratorMeta> =
      Reflect.getMetadata(listenerMetas, target) || []

    listenersMeta.push({
      event: opts.event,
      id: propertyKey,
      func: Reflect.get(target, propertyKey),
    })

    Reflect.defineMetadata(listenerMetas, listenersMeta, target)
  }
}
