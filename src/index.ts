import 'reflect-metadata'

export { LunaworkClient } from './lib/lunawork-client'
export { Stage } from './lib/stage'
export { ILogger, LogLevel, LogMethods, Logger } from './lib/logger/logger'
export { IListenerDecoratorOptions, listener } from './lib/listener/decorator'
export { IListener } from './lib/listener/listener'
export {
  IWebsocketDecoratorOptions,
  wsListener,
} from './lib/websocket/decorator'
export { isCommandMessage, isMessage } from './lib/utils/type-guarding'
export { IWebsocket } from './lib/websocket/websocket'
export { Context } from './lib/utils/context'
export { IEvents } from './lib/types/events'

// Prefixed commands
export {
  command,
  ICommandDecoratorOptions,
} from './lib/commands/prefix/decorator'
export { optional } from './lib/commands/optional'
export { IPrefixCommand as ICommand } from './lib/commands/command'
export {
  dmsOnly,
  guildsOnly,
  hasGuildPermission,
  mergeInhibitors,
  Inhibitor,
} from './lib/commands/inhibitors'

// Slash commands
export {
  slashCommand,
  ICommandDecoratorOptions as ISlashCommandDecoratorOptions,
} from './lib/commands/slash/decorator'
export { ISlashCommand } from './lib/commands/command'
