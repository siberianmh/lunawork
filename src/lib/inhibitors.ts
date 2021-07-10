import { Message, CommandInteraction, PermissionResolvable } from 'discord.js'
import { LunaworkClient } from '../core/client'

export type Inhibitor = (
  msg: Message | CommandInteraction,
  client: LunaworkClient,
) => Promise<string | undefined>

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
  msg.member ? undefined : 'not in a guild'

export const dmsOnly: Inhibitor = async (msg) =>
  msg.channel!.type === 'DM' ? undefined : 'not in dms'

export const hasGuildPermission = (perm: PermissionResolvable) =>
  mergeInhibitors(guildsOnly, async (msg) =>
    // @ts-expect-error
    msg.member!.permissions.has(perm)
      ? undefined
      : 'missing discord permission ' + perm,
  )