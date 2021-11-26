import { ButtonInteraction } from 'discord.js'
import { Inhibitor } from '../inhibitors'
import { Stage } from '../../core/stage'

export interface IButton {
  func: (
    button: ButtonInteraction,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  customID: string
  stage: Stage
  inhibitors: Array<Inhibitor>
  onError: (msg: ButtonInteraction, error: Error) => void
}
