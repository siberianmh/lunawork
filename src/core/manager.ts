import { ApplicationCommandData } from 'discord.js'
import { LunaworkClient } from '../core/client'
import { Stage } from '../core/stage'
import { listener } from '../decorators/listener'
import { IListener, IWebSocket } from '../lib/types'
import { IButton } from '../lib/types/button'
import { IPrefixCommand } from '../lib/types/prefix'
import { ISelectMenu } from '../lib/types/select-menu'
import { ISlashCommand } from '../lib/types/slash-command'

export class Manager extends Stage {
  public constructor(public client: LunaworkClient) {
    super(client)
  }

  //#region Listeners
  public listeners: Set<IListener> = new Set()
  public websockets: Set<IWebSocket> = new Set()

  public registerListeners(listeners: Array<IListener>): void {
    for (const listener of listeners) {
      if (this.listeners.has(listener)) {
        return
      }

      const conflictingListener = Array.from(this.listeners).find(
        (l) => l.id === listener.id,
      )

      if (conflictingListener) {
        throw new Error(
          `Cannot add ${listener.id} because it would conflict with ${conflictingListener.id}.`,
        )
      }

      listener.wrapperFunc = (...args: Array<unknown>) =>
        listener.func.apply(listener.stage, args)
      this.listeners.add(listener)
      this.client.on(listener.event, listener.wrapperFunc)
    }
  }

  public removeListener(listener: IListener): void {
    if (listener.wrapperFunc) {
      this.client.removeListener(listener.event, listener.wrapperFunc)
    }

    this.listeners.delete(listener)
  }

  public getListenerById(id: string): IListener | undefined {
    return Array.from(this.listeners).find((c) => c.id === id)
  }

  public registerWebSocketListeners(wsListeners: Array<IWebSocket>): void {
    for (const websocket of wsListeners) {
      if (this.websockets.has(websocket)) {
        return
      }

      const conflictingWebsocket = Array.from(this.websockets).find(
        (w) => w.id === websocket.id,
      )

      if (conflictingWebsocket) {
        throw new Error(
          `Cannot add ${websocket.id} because it would conflict with ${conflictingWebsocket.id}.`,
        )
      }

      websocket.wrapperFunc = (...args: Array<unknown>) =>
        websocket.func.apply(websocket.stage, args)
      this.websockets.add(websocket)
      this.client.ws.on(websocket.event, websocket.wrapperFunc)
    }
  }

  public removeWebSocket(websocket: IWebSocket): void {
    if (websocket.wrapperFunc) {
      this.client.ws.removeListener(websocket.event, websocket.wrapperFunc)
    }
    this.websockets.delete(websocket)
  }

  public getWebSocketById(id: string): IWebSocket | undefined {
    return Array.from(this.websockets).find((w) => w.id === id)
  }
  //#endregion

  //#region Slash Commands
  public slashCmds: Set<ISlashCommand> = new Set()

  public async registerSlashCommands(cmds: Array<ISlashCommand>) {
    for (const cmd of cmds) {
      if (this.slashCmds.has(cmd)) {
        return
      }

      this.slashCmds.add(cmd)
    }
  }

  public getSlashByTrigger(trigger: string) {
    return Array.from(this.slashCmds).find((c) => c.trigger === trigger)
  }
  //#endregion

  //#region Prefixed Commands
  public cmds: Set<IPrefixCommand> = new Set()

  public registerPrefixCommands(cmds: Array<IPrefixCommand>) {
    for (const cmd of cmds) {
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
  }

  public getPrefixedCommandByTrigger(trigger: string) {
    return Array.from(this.cmds).find((c) => c.triggers.includes(trigger))
  }
  //#endregion

  //#region Buttons
  public buttons: Set<IButton> = new Set()

  public registerButtons(buttons: Array<IButton>) {
    for (const button of buttons) {
      if (this.buttons.has(button)) {
        return
      }

      this.buttons.add(button)
    }
  }
  //#endregion

  //#region Select Menus
  public selectMenus: Set<ISelectMenu> = new Set()

  public registerSelectMenus(menus: Array<ISelectMenu>) {
    for (const menu of menus) {
      if (this.selectMenus.has(menu)) {
        return
      }

      this.selectMenus.add(menu)
    }
  }
  //#endregion
}

export class SlashCommandManager extends Stage {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  @listener({ event: 'ready' })
  public async registerSlashCommands() {
    const { slashCmds } = this.client.manager

    for (const cmd of slashCmds) {
      const registerData: ApplicationCommandData = {
        name: cmd.name ?? cmd.trigger,
        description: cmd.description,
        options: cmd.options || [],
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
