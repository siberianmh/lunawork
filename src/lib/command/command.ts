import type { CommandInteraction, Message } from 'discord.js'
import type { ICommandArgument } from './decorator'
import type { Stage } from '../stage'
import type { Inhibitor } from './inhibitors'
import type { Awaited } from '../types'
import type { Context } from '../utils/context'

export interface ICommand {
  func: (
    usesContextAPI: Message | CommandInteraction | Context,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  args: Array<ICommandArgument>
  triggers: Array<string>
  id: string
  module: Stage
  single: boolean
  inhibitors: Array<Inhibitor>
  slashCommand: boolean | 'both'
  usesContextAPI: boolean
  onError: (msg: Message, error: Error) => void

  description?: string
}
