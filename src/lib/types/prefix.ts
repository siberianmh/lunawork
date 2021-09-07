import { Message } from 'discord.js'
import { Stage } from '../../core/stage'
import { Context } from '../context'
import { ICommandArgument } from '../../decorators/command'
import { Inhibitor } from '../inhibitors'
import { Awaited } from './util'

export interface IPrefixCommand {
  readonly func: (
    msg: Message | Context,
    ...typedArgs: Array<unknown>
  ) => Awaited<void>
  readonly args: Array<ICommandArgument>
  readonly triggers: Array<string>
  readonly id: string
  readonly stage: Stage
  readonly single: boolean
  readonly usesContextAPI: boolean
  readonly inhibitors: Array<Inhibitor>
  readonly onError: (msg: Message, error: Error) => void
  readonly description: string
}
