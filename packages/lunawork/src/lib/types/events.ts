import { ClientEvents, GatewayDispatchEvents } from 'discord.js'

export type IEvents = ClientEvents

export type DiscordEvent = keyof IEvents
export type WSEvent = GatewayDispatchEvents
