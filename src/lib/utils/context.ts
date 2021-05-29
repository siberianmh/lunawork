import { CommandInteraction, Message } from 'discord.js'
import { ICommand } from '../commands/command'

export class Context {
  constructor(
    public msg: Message | CommandInteraction,
    public prefix: string,
    public trigger: string,
    public cmd: ICommand,
  ) {}
}
