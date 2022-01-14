import { SelectMenuInteraction } from 'discord.js'
import { Stage } from '../../core/stage'
import { Inhibitor } from '../inhibitors'

export interface ISelectMenu {
  func: (
    selectMenu: SelectMenuInteraction,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  customID: string
  stage: Stage
  inhibitors: Array<Inhibitor>
  onError: (msg: SelectMenuInteraction, error: Error) => void
}
