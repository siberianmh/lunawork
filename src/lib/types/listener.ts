import { DiscordEvent, WSEvent } from './events'
import { Stage } from '../../core/stage'

export interface IListener {
  readonly id: string
  readonly event: DiscordEvent
  readonly stage: Stage
  readonly func: (...args: Array<unknown>) => void
  wrapperFunc?: (...args: Array<unknown>) => void
}

export interface IWebSocket {
  readonly id: string
  readonly event: WSEvent
  readonly stage: Stage
  readonly func: (...args: Array<unknown>) => void
  wrapperFunc?: (...args: Array<unknown>) => void
}
