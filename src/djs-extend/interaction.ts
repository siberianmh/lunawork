import {
  Base,
  SnowflakeUtil,
  Client,
  Snowflake,
  User,
  GuildMember,
} from 'discord.js'
import { InteractionTypes } from './types'

/**
 * Represents an interaction.
 */
export class Interaction extends Base {
  public type: any
  public id: Snowflake
  public channelID: Snowflake | null
  public guildID: Snowflake | null
  public user: User
  public member: GuildMember | null
  protected token: string

  public constructor(client: Client, data: any) {
    super(client)

    /**
     * The type of this interaction
     */
    this.type = InteractionTypes[data.type]

    /**
     * The ID of this interaction
     */
    this.id = data.id

    /**
     * The token of this interaction
     */
    this.token = data.token

    /**
     * The ID of the channel this interaction was sent in
     */
    this.channelID = data.channel_id ?? null

    /**
     * The ID of the guild this interaction was sent in
     */
    this.guildID = data.guild_id ?? null

    /**
     * The user which sent this interaction
     */
    this.user = this.client.users.add(data.user ?? data.member.user)

    /**
     * If this interaction was sent in a guild, the member which sent in
     */
    this.member = data.member
      ? this.guild?.members.add(data.member) ?? null
      : null
  }

  /**
   * The timestamp the interaction was created at
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp
  }

  /**
   * The time the interaction was created at
   */
  get createdAt() {
    return new Date(this.createdTimestamp)
  }

  /**
   * The channel this interaction was sent in
   */
  get channel() {
    return this.client.channels.cache.get(this.channelID!) ?? null
  }

  /**
   * The guild this interaction was sent in
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildID!) ?? null
  }

  /**
   * Indicates whether this interaction is a command interaction.
   */
  isCommand() {
    // @ts-expect-error
    return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND
  }
}
