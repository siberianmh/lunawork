import { ButtonInteraction, CommandInteraction, Message } from 'discord.js'
import {
  IPrefixCommand,
  ISlashCommand,
  IButton,
} from '../commands/types/command'

export class Context {
  constructor(
    public msg: Message | ButtonInteraction | CommandInteraction,
    public prefix: string,
    public trigger: string,
    public cmd: IPrefixCommand | ISlashCommand | IButton,
  ) {}
}
