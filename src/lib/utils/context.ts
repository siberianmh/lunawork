import { CommandInteraction, Message } from 'discord.js'
import { IPrefixCommand } from '../commands/types/command'

export class Context {
  constructor(
    public msg: Message | CommandInteraction,
    public prefix: string,
    public trigger: string,
    public cmd: IPrefixCommand,
  ) {}
}
