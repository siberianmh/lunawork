import { Message, CommandInteraction, ButtonInteraction } from 'discord.js'

/**
 * Check whether a given message is a Message
 * @param message The message to check
 */
export function isMessage(message: unknown): message is Message {
  return message instanceof Message
}

/**
 * Check whether a given message is a CommandInteraction
 * @param message The message to check
 */
export function isCommandMessage(
  message: unknown,
): message is CommandInteraction {
  return message instanceof CommandInteraction
}

/**
 * Check whether a given message is a ButtonInteraction
 * @param message The message object to check
 */
export function isButtonMessage(
  message: unknown,
): message is ButtonInteraction {
  return message instanceof ButtonInteraction
}
