import {
  Message,
  CommandInteraction,
  PermissionResolvable,
  SelectMenuInteraction,
  ContextMenuCommandInteraction,
  ButtonInteraction,
  Embed,
  ActionRow,
  ChannelType,
} from 'discord.js'
import { LunaworkClient } from '../core/client'

/**
 */
export type Inhibitor = (
  msg:
    | Message
    | CommandInteraction
    | SelectMenuInteraction
    | ButtonInteraction
    | ContextMenuCommandInteraction,
  client: LunaworkClient,
) => Promise<
  | string
  | {
      content?: string
      embeds?: Array<Embed>
      components?: Array<ActionRow>
      /**
       * NOTE: Will be silently skipped when using prefixed commands,
       *       and will be used in application commands
       */
      ephemeral?: boolean
    }
  | undefined
>

export function mergeInhibitors(a: Inhibitor, b: Inhibitor): Inhibitor {
  return async (msg, client) => {
    const aReason = await a(msg, client)
    if (aReason) {
      return aReason
    } else {
      return await b(msg, client)
    }
  }
}

export const guildsOnly: Inhibitor = async (msg) =>
  msg.member ? undefined : { content: 'not in a guild' }

export const dmsOnly: Inhibitor = async (msg) =>
  msg.channel!.type === ChannelType.DM ? undefined : { content: 'not in dms' }

export const hasGuildPermission = (perm: PermissionResolvable) =>
  mergeInhibitors(guildsOnly, async (msg) =>
    typeof msg.member!.permissions !== 'string' &&
    msg.member!.permissions.has(perm)
      ? undefined
      : { content: `missing discord permission: ${perm}` },
  )
