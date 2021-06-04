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
