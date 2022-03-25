import { CommandInteraction, AutocompleteInteraction } from 'discord.js'
import { Inhibitor } from '../../inhibitors'
import type { Stage } from '../../../core/stage'
import { IApplicationCommandOption } from './chat-input'
import { ApplicationCommandTypes, LocalizationMap } from './shared'

export interface IApplicationCommandDiscordBase {
  /**
   * 1-32 character name; `CHAT_INPUT` command names must be all lowercased matching `^[\w-]{1,32}$`
   */
  readonly name?: string
  /**
   * Localization dictionary for the name field. Values follow the same restrictions as name
   */
  readonly name_localizations?: LocalizationMap
  readonly options?: Array<IApplicationCommandOption>
}

export interface IChatInputApplicationCommand
  extends IApplicationCommandDiscordBase {
  readonly description?: string
  /**
   * Localization dictionary for the description field. Values follow the same restrictions as description
   */
  readonly description_locazations?: LocalizationMap
  // TODO: types
  readonly type?:
    | ApplicationCommandTypes.CHAT_INPUT
    | ApplicationCommandTypes.MESSAGE
    | ApplicationCommandTypes.USER
}

export interface IContextMenuApplicationCommand
  extends Omit<IApplicationCommandDiscordBase, 'description'> {
  readonly type: ApplicationCommandTypes.MESSAGE | ApplicationCommandTypes.USER
}

export interface IApplicationCommandLunaworkBase {
  /**
   * Does the command should not be registered automatically.
   *
   * Defaults to `false`
   */
  readonly disabled?: boolean
  readonly inhibitors?: Array<Inhibitor>
  readonly onError?: (msg: CommandInteraction, error: Error) => void
  readonly onAutocomplete?: (
    msg: AutocompleteInteraction,
    typedArgs: Record<string, unknown>,
  ) => void
}

export type IApplicationCommandDecoratorOptions =
  | IChatInputApplicationCommand & IApplicationCommandLunaworkBase

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
  description: string
}

export * from './shared'
export * from './chat-input'
