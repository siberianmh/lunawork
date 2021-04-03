import { Message } from 'discord.js'
import { ICommand } from '../command/command'

export class Context {
  constructor(
    public msg: Message,
    public prefix: string,
    public trigger: string,
    public cmd: ICommand,
  ) {}
}
