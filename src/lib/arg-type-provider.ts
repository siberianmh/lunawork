import { Message, User, GuildMember } from 'discord.js'
import type { LunaworkClient } from '../core/client'
import { toBigIntLiteral } from './to-bigint'

export type ArgTypes = Record<string, (s: string, msg: Message) => unknown>

const USER_PATTERN = /(?:<@!?)?(\d+)>?/
const CHANNEL_PATTERN = /(?:<#)?(\d+)>?/
const ROLE_PATTERN = /(?:<@&)?(\d+)>?/

export function getArgTypes(client: LunaworkClient) {
  return Object.assign({
    Number: (s) => (isNaN(parseFloat(s)) ? null : parseFloat(s)),
    String: (s) => s,
    Command: (s) => client.manager.getPrefixedCommandByTrigger(s),
    Listener: (s) => client.manager.getListenerById(s),
    User: (s, msg) => {
      const res = USER_PATTERN.exec(s)
      let user: User | undefined

      if (res && res[1]) {
        user = msg.client.users.cache.get(toBigIntLiteral(res[1]))
      }
      if (!user) {
        user = msg.client.users.cache.find(
          (m) => m.tag.toLowerCase() === s.toLowerCase(),
        )
      }
      if (!user) {
        user = msg.client.users.cache.find(
          (u) => u.username.toLowerCase() === s.toLowerCase(),
        )
      }
      return user
    },
    GuildMember: (s, msg) => {
      if (!msg.guild) {
        return
      }
      const res = USER_PATTERN.exec(s)
      let member: GuildMember | undefined
      if (res && res[1]) {
        member = msg.guild.members.cache.get(toBigIntLiteral(res[1]))
      }
      if (!member) {
        member = msg.guild.members.cache.find(
          (m) => m.user.tag.toLowerCase() === s.toLowerCase(),
        )
      }
      if (!member) {
        member = msg.guild.members.cache.find(
          (m) => m.nickname?.toLowerCase() === s.toLowerCase(),
        )
      }
      if (!member) {
        member = msg.guild.members.cache.find(
          (m) => m.user.username.toLowerCase() === s.toLowerCase(),
        )
      }
      return member
    },
    TextChannel: (s, msg) => {
      const res = CHANNEL_PATTERN.exec(s)
      if (!res || !msg.guild) {
        return
      }
      return msg.guild.channels.cache.get(toBigIntLiteral(res[1]))
    },
    Role: (s, msg) => {
      const res = ROLE_PATTERN.exec(s)
      if (!res || !msg.guild) {
        return
      }
      return msg.guild.roles.cache.get(toBigIntLiteral(res[1]))
    },
  } as ArgTypes)
}
