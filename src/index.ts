import 'reflect-metadata'

export { LunaworkClient } from './lib/lunawork-client'
export { Stage } from './lib/stage'
export { ILogger, LogLevel, LogMethods, Logger } from './lib/logger/logger'
export { IListenerDecoratorOptions, listener } from './lib/listener/decorator'
export { IListener, IWebSocket } from './lib/listeners/types'
export {
  IWebSocketDecoratorOptions,
  wsListener,
} from './lib/listeners/websocket/decorator'
export { isCommandMessage, isMessage } from './lib/utils/type-guarding'
export { Context } from './lib/utils/context'
export { IEvents } from './lib/types/events'

// Prefixed commands
export {
  command,
  IPrefixCommanDecoratorOptions,
} from './lib/commands/prefix/decorator'
export { optional } from './lib/commands/prefix/optional'
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
  ISlashCommandDecoratorOptions,
} from './lib/commands/slash/decorator'

export { IPrefixCommand, ISlashCommand } from './lib/commands/types/command'
