import { Stage } from '../../stage'
import { IListener } from '../types'
import { listenerMetas } from '../../utils/reflect-prefixes'

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
