import { LunaworkClient } from '../lunawork-client'
import { IListener, IWebSocket } from '../listeners/types'

export class EventEmitterManager {
  public websockets: Set<IWebSocket> = new Set()
  public listeners: Set<IListener> = new Set()

  public constructor(public client: LunaworkClient) {}

  public addListener(listener: IListener): void {
    if (this.listeners.has(listener)) {
      return
    }

    const conflictingListener = Array.from(this.listeners).find(
      (l) => l.id === listener.id,
    )
    if (conflictingListener) {
      throw new Error(
        `Cannot add ${listener.id} because it would conflict with ${conflictingListener.id}.`,
      )
    }
    listener.wrapperFunc = (...args: Array<any>) =>
      listener.func.apply(listener.module, args)
    this.listeners.add(listener)
    this.client.on(listener.event, listener.wrapperFunc)
  }

  public removeListener(listener: IListener): void {
    if (listener.wrapperFunc) {
      this.client.removeListener(listener.event, listener.wrapperFunc)
    }
    this.listeners.delete(listener)
  }

  public getListenerById(id: string): IListener | undefined {
    return Array.from(this.listeners).find((c) => c.id === id)
  }

  public addWebSocket(websocket: IWebSocket): void {
    if (this.websockets.has(websocket)) {
      return
    }

    const conflictingWebsocket = Array.from(this.websockets).find(
      (w) => w.id === websocket.id,
    )
    if (conflictingWebsocket) {
      throw new Error(
        `Cannot add ${websocket.id} because it would conflict with ${conflictingWebsocket.id}.`,
      )
    }
    websocket.wrapperFunc = (...args: Array<any>) =>
      websocket.func.apply(websocket.module, args)
    this.websockets.add(websocket)
    this.client.ws.on(websocket.event, websocket.wrapperFunc)
  }

  public removeWebSocket(websocket: IWebSocket): void {
    if (websocket.wrapperFunc) {
      this.client.ws.removeListener(websocket.event, websocket.wrapperFunc)
    }
    this.websockets.delete(websocket)
  }

  public getWebSocketById(id: string): IWebSocket | undefined {
    return Array.from(this.websockets).find((w) => w.id === id)
  }
}
