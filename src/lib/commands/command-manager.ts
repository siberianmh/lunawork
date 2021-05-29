import { IPrefixCommand as ICommand } from './command'

export class CommandManager {
  public cmds: Set<ICommand> = new Set()

  public add(cmd: ICommand) {
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

  public remove(cmd: ICommand) {
    this.cmds.delete(cmd)
  }

  public getByTrigger(trigger: string) {
    return Array.from(this.cmds).find((c) => c.triggers.includes(trigger))
  }
}
