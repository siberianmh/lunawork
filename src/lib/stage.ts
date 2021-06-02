import 'reflect-metadata'
import { LunaworkClient } from './lunawork-client'
import { getArgTypes } from './utils/arg-type-provider'
import {
  commandMetas,
  slashCommandMetas,
  listenerMetas,
  websocketMetas,
} from './utils/reflect-prefixes'

// Prefixed commands
import { IPrefixCommand, ISlashCommand } from './commands/command'
import { ICommandDecorator } from './commands/prefix/decorator'
import { ICommandDecorator as ISlashCommandDecorator } from './commands/slash/decorator'

// Listener
import { IListener } from './listener/listener'
import { IListenerDecoratorMeta } from './listener/decorator'

// WebSocket Listener
import { IWebsocket } from './websocket/websocket'
import { IWebsocketDecoratorMeta } from './websocket/decorator'

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
    const websocketsMeta: Array<IWebsocketDecoratorMeta> =
      Reflect.getMetadata(websocketMetas, this) || []

    return websocketsMeta.map(
      (meta) =>
        ({
          event: meta.event,
          id: this.constructor.name + '/' + meta.id,
          module: this,
          func: meta.func,
        } as IWebsocket),
    )
  }

  public processCommands() {
    const targetMetas: Array<ICommandDecorator> =
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
          module: this,
          onError: meta.onError,
          usesContextAPI: meta.usesContextAPI,
          trigger: meta.id,
        } as ISlashCommand),
    )

    return cmds
  }
}
