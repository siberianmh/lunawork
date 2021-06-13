import type {
  ApplicationCommandData,
  ButtonInteraction,
  CommandInteraction,
  Message,
} from 'discord.js'
import type { ICommandArgument } from './../prefix/decorator'
import type { Stage } from '../../stage'
import type { Inhibitor } from '../inhibitors'
import type { Awaited } from '../../types'
import type { Context } from '../../utils/context'

export interface IPrefixCommand {
  readonly func: (
    usesContextAPI: Message | Context,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  readonly args: Array<ICommandArgument>
  readonly triggers: Array<string>
  readonly id: string
  readonly module: Stage
  readonly single: boolean
  readonly inhibitors: Array<Inhibitor>
  readonly usesContextAPI: boolean
  readonly onError: (msg: Message, error: Error) => void
  readonly description: string
}

export interface ISlashCommand extends Partial<ApplicationCommandData> {
  func: (
    usesContextAPI: CommandInteraction | Context,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  module: Stage
  inhibitors: Array<Inhibitor>
  usesContextAPI: boolean
  trigger: string
  onError: (msg: CommandInteraction, error: Error) => void
  description: string
}

export interface IButton {
  func: (
    button: ButtonInteraction,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  id: string
  customId: string
  module: Stage
  onError: (msg: ButtonInteraction, error: Error) => void
}
