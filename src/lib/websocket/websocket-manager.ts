import { LunaworkClient } from '../lunawork-client'
import { IWebSocket } from '../listeners/types'

export class WebsocketManager {
  public websockets: Set<IWebSocket> = new Set()

  public constructor(public client: LunaworkClient) {}

  public add(websocket: IWebSocket) {
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

  public remove(websocket: IWebSocket) {
    if (websocket.wrapperFunc) {
      this.client.ws.removeListener(websocket.event, websocket.wrapperFunc)
    }
    this.websockets.delete(websocket)
  }

  public getById(id: string): IWebSocket | undefined {
    return Array.from(this.websockets).find((w) => w.id === id)
  }
}
