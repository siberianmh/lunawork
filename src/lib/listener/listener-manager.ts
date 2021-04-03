import { LunaworkClient } from '../lunawork-client'
import { IListener } from './listener'

export class ListenerManager {
  public listeners: Set<IListener> = new Set()

  public constructor(public client: LunaworkClient) {}

  public add(listener: IListener) {
    if (this.listeners.has(listener)) {
      return
    }

    const confictingListener = Array.from(this.listeners).find(
      (l) => l.id === listener.id,
    )
    if (confictingListener) {
      throw new Error(
        `Cannot add ${listener.id} because it would conflict with ${confictingListener.id}.`,
      )
    }
    listener.wrapperFunc = (...args: Array<any>) =>
      listener.func.apply(listener.module, args)
    this.listeners.add(listener)
    this.client.on(listener.event, listener.wrapperFunc)
  }

  public remove(listener: IListener) {
    if (listener.wrapperFunc) {
      this.client.removeListener(listener.event, listener.wrapperFunc)
    }
    this.listeners.delete(listener)
  }

  public getById(id: string): IListener | undefined {
    return Array.from(this.listeners).find((c) => c.id === id)
  }
}
