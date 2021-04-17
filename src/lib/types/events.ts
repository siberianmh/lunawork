import { ClientEvents, WSEventType } from 'discord.js'
import { Context } from '../utils/context'

export interface IEvents extends ClientEvents {
  //#region Lunawork custom events
  commandExecution: [Context]
  //#endregion
}

export type Event = keyof IEvents
export type WSEvent = WSEventType

declare module 'discord.js' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface ClientEvents {
    //#region Lunawork custom events
    commandExecution: [Context]
    //#endregion
  }
}
