import { ModalSubmitInteraction } from 'discord.js'
import { Stage } from '../../core/stage'
import { Inhibitor } from '../inhibitors'

export interface IModal {
  func: (
    modal: ModalSubmitInteraction,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  customID: string
  stage: Stage
  inhibitors: Array<Inhibitor>
  onError: (msg: ModalSubmitInteraction, error: Error) => void
}
