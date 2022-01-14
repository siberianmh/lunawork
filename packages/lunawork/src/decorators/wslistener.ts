import { Stage } from '../core/stage'
import { WSEvent } from '../lib/types'
import { webSocketMetaKey } from '../lib/reflect-prefixes'

export interface IWebSocketDecoratorOptions {
  event: WSEvent
}

export interface IWebSocketDecoratorMeta {
  readonly event: WSEvent
  readonly id: string
  readonly func: (...args: Array<unknown>) => void
}

export function wsListener(opts: IWebSocketDecoratorOptions) {
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
        `Decorator needs to be applied to a Method. (${target.constructor.name}#${descriptor.value.name} was ${descriptor.value.constructor.name})`,
      )
    }

    const meta: Array<IWebSocketDecoratorMeta> =
      Reflect.getMetadata(webSocketMetaKey, target) || []

    meta.push({
      id: propertyKey,
      event: opts.event,
      func: Reflect.get(target, propertyKey),
    })

    Reflect.defineMetadata(webSocketMetaKey, meta, target)
  }
}
