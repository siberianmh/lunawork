import { ApplicationCommandData, CommandInteraction } from 'discord.js'
import { Inhibitor } from '../inhibitors'
import { Awaited } from './util'
import type { Stage } from '../../core/stage'

export interface ISlashCommand extends Partial<ApplicationCommandData> {
  func: (msg: CommandInteraction, ...typedArgs: Array<unknown>) => Awaited<void>
  id: string
  stage: Stage
  inhibitors: Array<Inhibitor>
  trigger: string
  onError: (msg: CommandInteraction, error: Error) => void
  description: string
}
