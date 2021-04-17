import { WSEvent } from '../types/events'
import { Stage } from '../stage'

export interface IWebsocket {
  readonly event: WSEvent
  readonly id: string
  readonly module: Stage
  readonly func: (...args: Array<any>) => void
  wrapperFunc?: (...args: Array<any>) => void
}
