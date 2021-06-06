import { ApplicationCommandData } from 'discord.js'
import { listener } from '../listeners/listener/decorator'
import { LunaworkClient } from '../lunawork-client'
import { Stage } from '../stage'
import { IPrefixCommand, ISlashCommand } from './types/command'

export class CommandManager {
  public cmds: Set<IPrefixCommand> = new Set()
  public slashCmds: Set<ISlashCommand> = new Set()

  public add(cmd: IPrefixCommand | ISlashCommand) {
    if ('triggers' in cmd) {
      return this.addPrefixCmd(cmd)
    } else {
      return this.addSlashCmd(cmd)
    }
  }

  private addPrefixCmd(cmd: IPrefixCommand) {
    if (this.cmds.has(cmd)) {
      return
    }
    const conflictingCommand = Array.from(this.cmds).find((cm) =>
      cmd.triggers.some((trigger) => cm.triggers.includes(trigger)),
    )
    if (conflictingCommand) {
      throw new Error(
        `Cannot add ${cmd.id} because it would conflict with ${conflictingCommand.id}.`,
      )
    }
    this.cmds.add(cmd)
  }

  private addSlashCmd(cmd: ISlashCommand) {
    if (this.slashCmds.has(cmd)) {
      return
    }

    this.slashCmds.add(cmd)
  }

  public remove(cmd: IPrefixCommand | ISlashCommand) {
    if ('triggers' in cmd) {
      this.cmds.delete(cmd)
    } else {
      this.slashCmds.delete(cmd)
    }
  }

  public getPrefixedByTrigger(trigger: string) {
    return Array.from(this.cmds).find((c) => c.triggers.includes(trigger))
  }

  public getSlashByTrigger(trigger: string) {
    return Array.from(this.slashCmds).find((c) => c.trigger === trigger)
  }
}

export class SlashCommandManager extends Stage {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  @listener({ event: 'ready' })
  public async registerSlashCommands() {
    const { slashCmds } = this.client.commandManager

    for (const cmd of slashCmds) {
      const registerData: ApplicationCommandData = {
        name: cmd.name ?? cmd.trigger,
        description: cmd.description,
        options: cmd.options ?? [],
      }

      await this.register(registerData)
    }

    return
  }

  private async register(command: ApplicationCommandData) {
    if (process.env.NODE_ENV === 'development') {
      const guilds = this.client.guilds.cache.array()

      for (const guild of guilds) {
        await guild.commands.create(command)
      }
    } else {
      await this.client.application?.commands.create(command)
    }

    return
  }
}
