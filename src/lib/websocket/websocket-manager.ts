import { LunaworkClient } from '../lunawork-client'
import { IWebsocket } from './websocket'

export class WebsocketManager {
  public websockets: Set<IWebsocket> = new Set()

  public constructor(public client: LunaworkClient) {}

  public add(websocket: IWebsocket) {
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

  public remove(websocket: IWebsocket) {
    if (websocket.wrapperFunc) {
      this.client.ws.removeListener(websocket.event, websocket.wrapperFunc)
    }
    this.websockets.delete(websocket)
  }

  public getById(id: string): IWebsocket | undefined {
    return Array.from(this.websockets).find((w) => w.id === id)
  }
}
