import { Stage } from '../core/stage'
import { IListener } from '../lib/types'
import { listenerMetaKey } from '../lib/reflect-prefixes'

export type IListenerDecoratorOptions = Pick<IListener, 'event'>
export type IListenerDecoratorMeta = Pick<IListener, 'event' | 'id' | 'func'>

export function listener(opts: IListenerDecoratorOptions) {
  return function (
    target: Stage,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    if (!(target instanceof Stage)) {
      throw new TypeError(
        `${(target as any).constructor.name} doesn't extend Stage`,
      )
    }

    if (!(descriptor.value.constructor instanceof Function)) {
      throw new TypeError(
        `Decorator needs to be applied to a Method. (${target.constructor.name}#${descriptor.value.name} was ${descriptor.value.constructor.name})`,
      )
    }

    const meta: Array<IListenerDecoratorMeta> =
      Reflect.getMetadata(listenerMetaKey, target) || []

    meta.push({
      id: propertyKey,
      event: opts.event,
      func: Reflect.get(target, propertyKey),
    })

    Reflect.defineMetadata(listenerMetaKey, meta, target)
  }
}
