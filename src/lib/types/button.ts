import { ButtonInteraction } from 'discord.js'
import { Stage } from '../../core/stage'
import { Awaited } from './util'

export interface IButton {
  func: (
    button: ButtonInteraction,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  customID: string
  stage: Stage
  onError: (msg: ButtonInteraction, error: Error) => void
}
