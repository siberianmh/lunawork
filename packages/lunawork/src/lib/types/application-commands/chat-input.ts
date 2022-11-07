import {
  LocalizationMap,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10'

interface IApplicationCommandOptionBase {
  type:
    | ApplicationCommandOptionType.Boolean
    | ApplicationCommandOptionType.User
    | ApplicationCommandOptionType.Role
    | ApplicationCommandOptionType.Mentionable
  name: string
  name_localizations?: LocalizationMap
  description: string
  description_localizations?: LocalizationMap
  default?: boolean
  required?: boolean
  autocomplete?: never
}

export type IApplicationCommandOption =
  | IApplicationCommandStringArgumentOptions
  | IApplicationCommandSubCommandOptions
  | IApplicationCommandOptionBase
  | IApplicationCommandChannelOptions
  | IApplicationCommandNumberArgumentOptions
  | IApplicationCommandStringAutocompleteOptions
  | IApplicationCommandNumericAutocompleteOptions

/**
 * If the option is a `SUB_COMMAND` or `SUB_COMMAND_GROUP` type, this nested options will be the parameters.
 */
export interface IApplicationCommandSubCommandOptions
  extends Omit<IApplicationCommandOptionBase, 'type'> {
  type:
    | ApplicationCommandOptionType.Subcommand
    | ApplicationCommandOptionType.SubcommandGroup
  options?: Array<IApplicationCommandOption>
}

/**
 * In contrast to `IApplicationCommandSubCommandOptions`, these types cannot have an `options` array,
 * but they can have a either a `choices` or a `autocomplete` field wherre it's set to false.
 */
export interface IApplicationCommandStringArgumentOptions
  extends Omit<IApplicationCommandOptionBase, 'type' | 'autocomplete'> {
  type:
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number
  choices?: Array<APIApplicationCommandOptionChoice>
  autocomplete?: false
}

export interface IApplicationCommandStringAutocompleteOptions
  extends Omit<IApplicationCommandOptionBase, 'type' | 'autocomplete'> {
  type:
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number
  autocomplete: true
}

export interface IApplicationCommandNumericAutocompleteOptions
  extends Omit<IApplicationCommandOptionBase, 'type' | 'autocomplete'> {
  type:
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number
  autocomplete: true
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the minimum value permitted.
   */
  min_value?: number
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the minimum value permitted.
   */
  max_value?: number
}

export interface IApplicationCommandNumberArgumentOptions
  extends Omit<IApplicationCommandOptionBase, 'type' | 'autocomplete'> {
  type:
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number
  choices?: Array<APIApplicationCommandOptionChoice>
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the minimum value permitted.
   */
  min_value?: number
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the maximum value permitted.
   */
  max_value?: number
  autocomplete?: false
}

export interface IApplicationCommandChannelOptions
  extends Omit<IApplicationCommandOptionBase, 'type'> {
  type: ApplicationCommandOptionType.Channel
  // TODO: Add types
  channel_types?: Array<any>
}

export { ApplicationCommandOptionType }
