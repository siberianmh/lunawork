import { ClientEvents, WSEventType } from 'discord.js'

export type IEvents = ClientEvents

export type DiscordEvent = keyof IEvents
export type WSEvent = WSEventType
