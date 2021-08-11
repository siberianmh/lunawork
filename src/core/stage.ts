import 'reflect-metadata'

import { IListenerDecoratorMeta } from '../decorators/listener'
import { LunaworkClient } from './client'
import {
  buttonMetaKey,
  commandMetaKey,
  listenerMetaKey,
  selectMenuMetaKey,
  applicationCommandMetaKey,
  webSocketMetaKey,
} from '../lib/reflect-prefixes'
import { IListener, IWebSocket } from '../lib/types'
import { IWebSocketDecoratorMeta } from '../decorators/wslistener'
import { IApplicationCommandDecorator } from '../decorators/application-command'
import { IApplicationCommand } from '../lib/types/application-command'
import { IPrefixCommand } from '../lib/types/prefix'
import { IPrefixCommanDecorator } from '../decorators/command'
import { getArgTypes } from '../lib/arg-type-provider'
import { IButtonDecorator } from '../decorators/button'
import { IButton } from '../lib/types/button'
import { ISelectMenuDecorator } from '../decorators/select-menu'
import { ISelectMenu } from '../lib/types/select-menu'

export class Stage {
  public client: LunaworkClient

  public constructor(client: LunaworkClient) {
    this.client = client
  }

  public process() {
    const listenerMeta: Array<IListenerDecoratorMeta> =
      Reflect.getMetadata(listenerMetaKey, this) || []

    const listeners = listenerMeta.map(
      (meta) =>
        ({
          event: meta.event,
          id: this.constructor.name + '/' + meta.id,
          stage: this,
          func: meta.func,
        } as IListener),
    )

    const wsListenerMeta: Array<IWebSocketDecoratorMeta> =
      Reflect.getMetadata(webSocketMetaKey, this) || []

    const wsListeners = wsListenerMeta.map(
      (meta) =>
        ({
          id: this.constructor.name + '/' + meta.id,
          event: meta.event,
          stage: this,
          func: meta.func,
        } as IWebSocket),
    )

    const applicationCommandMeta: Array<IApplicationCommandDecorator> =
      Reflect.getMetadata(applicationCommandMetaKey, this) || []

    const applicationCommands = applicationCommandMeta.map(
      (meta) =>
        ({
          id: this.constructor.name + '/' + meta.id,
          func: Reflect.get(this, meta.id),
          inhibitors: meta.inhibitors,
          options: meta.options,
          stage: this,
          onError: meta.onError,
          trigger: meta.id,
          description: meta.description,
        } as IApplicationCommand),
    )

    const prefixCommandsMeta: Array<IPrefixCommanDecorator> =
      Reflect.getMetadata(commandMetaKey, this) || []

    const prefixCommands = prefixCommandsMeta.map(
      (meta) =>
        ({
          description: meta.description,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
          args: meta.args,
          triggers: [meta.id, ...meta.aliases].map((id) => id.toLowerCase()),
          stage: this,
          single: meta.single,
          inhibitors: meta.inhibitors,
          usesContextAPI: meta.usesContextAPI,
          onError: meta.onError,
        } as IPrefixCommand),
    )

    prefixCommands.forEach((cmd) => {
      cmd.args.forEach((arg) => {
        if (!getArgTypes(this.client)[arg.type.name]) {
          throw new Error(
            `command tried to use an unsupported argument type ${arg.type.name}`,
          )
        }
      })
    })

    const buttonsMeta: Array<IButtonDecorator> =
      Reflect.getMetadata(buttonMetaKey, this) || []

    const buttons = buttonsMeta.map(
      (meta) =>
        ({
          customID: meta.customID,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
          stage: this,
          onError: meta.onError,
        } as IButton),
    )

    const selectMenusMeta: Array<ISelectMenuDecorator> =
      Reflect.getMetadata(selectMenuMetaKey, this) || []

    const selectMenus = selectMenusMeta.map(
      (meta) =>
        ({
          customID: meta.customID,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
          onError: meta.onErorr,
          stage: this,
        } as ISelectMenu),
    )

    return {
      listeners,
      wsListeners,
      applicationCommands,
      prefixCommands,
      buttons,
      selectMenus,
    }
  }
}
