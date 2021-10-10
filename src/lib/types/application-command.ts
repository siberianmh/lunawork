import type { APIApplicationCommandOption } from 'discord-api-types/v9'
import { ApplicationCommandOptionData, CommandInteraction } from 'discord.js'
import { Inhibitor } from '../inhibitors'
import { Awaited } from './util'
import type { Stage } from '../../core/stage'

export interface IApplicationCommandDecoratorOptions {
  readonly name?: string
  readonly description?: string
  readonly type?: 'CHAT_INPUT' | 'MESSAGE' | 'USER'
  readonly options?:
    | Array<APIApplicationCommandOption>
    | Array<ApplicationCommandOptionData>

  /**
   * Does the command should not be registered automatically.
   *
   * Defaults to `false`
   */
  readonly disabled?: boolean
  readonly inhibitors?: Array<Inhibitor>
  readonly onError?: (msg: CommandInteraction, error: Error) => void
}

export interface IApplicationCommand
  extends Partial<IApplicationCommandDecoratorOptions> {
  id: string
  func: (msg: CommandInteraction, ...typedArgs: Array<unknown>) => Awaited<void>

  stage: Stage
  inhibitors: Array<Inhibitor>
  trigger: string
  onError: (msg: CommandInteraction, error: Error) => void
  description: string
}
