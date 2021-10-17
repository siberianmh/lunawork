import type { APIApplicationCommandOption } from 'discord-api-types/v9'
import { CommandInteraction } from 'discord.js'
import { Inhibitor } from '../inhibitors'
import { Awaited } from './util'
import type { Stage } from '../../core/stage'

export { ApplicationCommandOptionType } from 'discord-api-types/v9'
export enum ApplicationCommandTypes {
  CHAT_INPUT = 1,
  MESSAGE,
  USER,
}

export interface IApplicationCommandDecoratorOptions {
  readonly name?: string
  readonly description?: string
  readonly type?: ApplicationCommandTypes
  readonly options?: Array<APIApplicationCommandOption>

  /**
   * Does the command should not be registered automatically.
   *
   * Defaults to `false`
   */
  readonly disabled?: boolean
  readonly inhibitors?: Array<Inhibitor>
  readonly onError?: (msg: CommandInteraction, error: Error) => void
}

export interface IApplicationCommandDecoratorMeta {
  readonly id: string
}

export interface IApplicationCommand
  extends Partial<
    IApplicationCommandDecoratorOptions & IApplicationCommandDecoratorMeta
  > {
  func: (msg: CommandInteraction, ...typedArgs: Array<unknown>) => Awaited<void>

  stage: Stage
  inhibitors: Array<Inhibitor>
  trigger: string
  onError: (msg: CommandInteraction, error: Error) => void
  description: string
}
