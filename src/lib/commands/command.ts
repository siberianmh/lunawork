import type { CommandInteraction, Message } from 'discord.js'
import type { ICommandArgument } from './prefix/decorator'
import type { Stage } from '../stage'
import type { Inhibitor } from './inhibitors'
import type { Awaited } from '../types'
import type { Context } from '../utils/context'

export interface IPrefixCommand {
  func: (
    usesContextAPI: Message | Context,
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

export interface ISlashCommand {
  func: (
    usesContextAPI: CommandInteraction | Context,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  module: Stage
  inhibitors: Array<Inhibitor>
  usesContextAPI: boolean
  onError: (msg: CommandInteraction, error: Error) => void
  description: string
}
