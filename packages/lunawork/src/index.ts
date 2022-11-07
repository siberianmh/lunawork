import 'reflect-metadata'

export { LunaworkClient } from './core/client'
export { Stage } from './core/stage'

export type { IListenerDecoratorOptions } from './decorators/listener'
export type { IWebSocketDecoratorOptions } from './decorators/wslistener'
export type { IApplicationCommandDecoratorOptions } from './lib/types/application-commands'
export type { IPrefixCommandDecoratorOptions } from './decorators/command'
export type { IModalDecoratorOptions } from './decorators/modal'
export type { IButtonDecoratorOptions } from './decorators/button'
export type { ISelectMenuDecoratorOptions } from './decorators/select-menu'
export type { Inhibitor } from './lib/inhibitors'

// Decorators
export { listener } from './decorators/listener'
export { wsListener } from './decorators/wslistener'
export { applicationCommand } from './decorators/application-command'
export { command } from './decorators/command'
export { optional } from './decorators/optional'
export { modal } from './decorators/modal'
export { button } from './decorators/button'
export { selectMenu } from './decorators/select-menu'

// Utils
export {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from './lib/types'
export {
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
