import 'reflect-metadata'
import { LunaworkClient } from './lunawork-client'
import { getArgTypes } from './utils/arg-type-provider'
import {
  commandMetas,
  slashCommandMetas,
  listenerMetas,
  websocketMetas,
  buttonMetas,
} from './utils/reflect-prefixes'

import {
  IButton,
  IPrefixCommand,
  ISlashCommand,
} from './commands/types/command'
import { IPrefixCommandDecorator } from './commands/prefix/decorator'
import { ISlashCommandDecorator } from './commands/slash/decorator'

import { IListener, IWebSocket } from './listeners/types'
import { IListenerDecoratorMeta } from './listeners/listener/decorator'
import { IWebSocketDecoratorMeta } from './listeners/websocket/decorator'
import { IButtonDecorator } from './commands/buttons/decorator'

export class Stage {
  public client: LunaworkClient

  public constructor(client: LunaworkClient) {
    this.client = client
  }

  public processListeners() {
    const listenersMeta: Array<IListenerDecoratorMeta> =
      Reflect.getMetadata(listenerMetas, this) || []

    return listenersMeta.map(
      (meta) =>
        ({
          event: meta.event,
          id: this.constructor.name + '/' + meta.id,
          module: this,
          func: meta.func,
        } as IListener),
    )
  }

  public processWebSockets() {
    const websocketsMeta: Array<IWebSocketDecoratorMeta> =
      Reflect.getMetadata(websocketMetas, this) || []

    return websocketsMeta.map(
      (meta) =>
        ({
          event: meta.event,
          id: this.constructor.name + '/' + meta.id,
          module: this,
          func: meta.func,
        } as IWebSocket),
    )
  }

  public processCommands() {
    const targetMetas: Array<IPrefixCommandDecorator> =
      Reflect.getMetadata(commandMetas, this) || []

    const cmds = targetMetas.map(
      (meta) =>
        ({
          description: meta.description,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
          args: meta.args,
          triggers: [meta.id, ...meta.aliases].map((id) => id.toLowerCase()),
          module: this,
          single: meta.single,
          inhibitors: meta.inhibitors,
          onError: meta.onError,
          usesContextAPI: meta.usesContextAPI,
        } as IPrefixCommand),
    )

    cmds.forEach((cmd) =>
      cmd.args.forEach((arg) => {
        if (!getArgTypes(this.client)[arg.type.name]) {
          throw new Error(
            `command tried to use an unsupported argument type ${arg.type.name}`,
          )
        }
      }),
    )

    return cmds
  }

  public processButtons() {
    const targetMetas: Array<IButtonDecorator> =
      Reflect.getMetadata(buttonMetas, this) || []

    const buttons = targetMetas.map(
      (meta) =>
        ({
          customId: meta.customId,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
          module: this,
          onError: meta.onError,
        } as IButton),
    )

    return buttons
  }

  public processSlashCommands() {
    const targetMetas: Array<ISlashCommandDecorator> =
      Reflect.getMetadata(slashCommandMetas, this) || []

    const cmds = targetMetas.map(
      (meta) =>
        ({
          description: meta.description,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
          inhibitors: meta.inhibitors,
          options: meta.options,
          module: this,
          onError: meta.onError,
          usesContextAPI: meta.usesContextAPI,
          trigger: meta.id,
        } as ISlashCommand),
    )

    return cmds
  }
}
