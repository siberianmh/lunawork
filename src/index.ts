import 'reflect-metadata'

export { LunaworkClient } from './core/client'
export { Stage } from './core/stage'

// Decorators
export { IListenerDecoratorOptions, listener } from './decorators/listener'
export { IWebSocketDecoratorOptions, wsListener } from './decorators/wslistener'
export {
  ISlashCommandDecoratorOptions,
  slashCommand,
} from './decorators/slash-command'
export { IPrefixCommandDecoratorOptions, command } from './decorators/command'
export { optional } from './decorators/optional'
export { IButtonDecoratorOptions, button } from './decorators/button'
export {
  ISelectMenuDecoratorOptions,
  selectMenu,
} from './decorators/select-menu'

// Utils
export {
  Inhibitor,
  dmsOnly,
  guildsOnly,
  hasGuildPermission,
  mergeInhibitors,
} from './lib/inhibitors'
export {
  isButtonMessage,
  isCommandMessage,
  isMessage,
  isSelectMenuMessage,
} from './lib/type-guarding'
export { Context } from './lib/context'
