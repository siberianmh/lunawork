import { Message } from 'discord.js'
import { IPrefixCommand } from './types/prefix'

export class Context {
  public constructor(
    public msg: Message,
    public prefix: string,
    public trigger: string,
    public cmd: IPrefixCommand,
  ) {}
}
