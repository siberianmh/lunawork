import { WSEvent, Event } from '../../types/events'
import { Stage } from '../../stage'

export interface IWebSocket {
  readonly event: WSEvent
  readonly id: string
  readonly module: Stage
  readonly func: (...args: Array<any>) => void
  wrapperFunc?: (...args: Array<any>) => void
}

export interface IListener {
  readonly event: Event
  readonly id: string
  readonly module: Stage
  readonly func: (...args: Array<any>) => void
  wrapperFunc?: (...args: Array<any>) => void
}