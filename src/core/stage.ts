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
import {
  IListener,
  IWebSocket,
  ISelectMenu,
  IButton,
  IApplicationCommand,
  IPrefixCommand,
} from '../lib/types'
import { getArgTypes } from '../lib/arg-type-provider'
import { IWebSocketDecoratorMeta } from '../decorators/wslistener'
import { IApplicationCommandDecorator } from '../decorators/application-command'
import { IPrefixCommanDecorator } from '../decorators/command'
import { IButtonDecorator } from '../decorators/button'
import { ISelectMenuDecorator } from '../decorators/select-menu'

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
          ...meta,
          id: this.constructor.name + '/' + meta.id,
          func: Reflect.get(this, meta.id),
          options: meta.options,
          stage: this,
          trigger: meta.id,
          disabled: meta.disabled,
          onError: meta.onError,
          onAutocomplete:
            meta.onAutocomplete ||
            Reflect.get(this, `on${meta.name}Autocomplete`),
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
          ...meta,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
          stage: this,
        } as IButton),
    )

    const selectMenusMeta: Array<ISelectMenuDecorator> =
      Reflect.getMetadata(selectMenuMetaKey, this) || []

    const selectMenus = selectMenusMeta.map(
      (meta) =>
        ({
          ...meta,
          func: Reflect.get(this, meta.id),
          id: this.constructor.name + '/' + meta.id,
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
