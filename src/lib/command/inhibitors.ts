import { Message, PermissionResolvable } from 'discord.js'
import { LunaworkClient } from '../lunawork-client'

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
  msg.channel.type === 'dm' ? undefined : 'not in dms'

export const hasGuildPermission = (perm: PermissionResolvable) =>
  mergeInhibitors(guildsOnly, async (msg) =>
    msg.member!.permissions.has(perm)
      ? undefined
      : 'missing discord permission ' + perm,
  )

export type Inhibitor = (
  msg: Message,
  client: LunaworkClient,
) => Promise<string | undefined>
