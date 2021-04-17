import 'reflect-metadata'
import { LunaworkClient } from './lunawork-client'
import { ICommandDecorator } from './command/decorator'
import { IListenerDecoratorMeta } from './listener/decorator'
import { getArgTypes } from './utils/arg-type-provider'
import { ICommand } from './command/command'
import { IListener } from './listener/listener'
import { IWebsocket } from './websocket/websocket'
import {
  commandMetas,
  listenerMetas,
  websocketMetas,
} from './utils/reflect-prefixes'
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
        } as ICommand),
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
}
