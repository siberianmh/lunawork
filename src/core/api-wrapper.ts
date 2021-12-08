import { Client } from '../lib/request'

/**
 * This is an internal API wrapper that we use to perform some internal calls
 * to Discord API without wrapping the `discord.js` implementation.
 */
export class APIWrapper {
  private token: string
  private clientId: string
  private baseURL: string
  private client: Client

  public constructor(token: string, clientId: string) {
    this.token = token
    this.clientId = clientId

    this.baseURL = 'https://discord.com/api/v9'
    this.client = new Client()
  }

  // TODO: Add type
  public async bulkOverwriteGuildApplicationCommands(
    payload: any,
    guildId: string,
  ) {
    const url = new URL(
      `${this.baseURL}/applications/${this.clientId}/guilds/${guildId}/commands`,
    )

    return await this.client.put(
      url,
      { body: JSON.stringify(payload), headers: this.headers() },
      {
        route:
          '[PUT] /applications/{application.id}/guilds/{guild.id}/commands',
        identifier: `${this.clientId}${guildId}`,
      },
    )
  }

  // TODO: Add type
  public async bulkOverwriteGlobalApplicationCommands(payload: any) {
    const url = new URL(
      `${this.baseURL}/applications/${this.clientId}/commands`,
    )

    return await this.client.put(
      url,
      { body: JSON.stringify(payload), headers: this.headers() },
      {
        route: '[PUT] /applications/{application.id}/commands',
        identifier: `${this.clientId}`,
      },
    )
  }

  private headers = () => {
    return {
      Authorization: `Bot ${this.token}`,
      'Content-Type': 'application/json',
    }
  }
}
