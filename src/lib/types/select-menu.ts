import { SelectMenuInteraction } from 'discord.js'
import { Stage } from '../../core/stage'
import { Awaited } from './util'

export interface ISelectMenu {
  func: (
    selectMenu: SelectMenuInteraction,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  customID: string
  stage: Stage
  onError: (msg: SelectMenuInteraction, error: Error) => void
}
