import got, { Method } from 'got'

/**
 * This is an internal API wrapper that we use to perform some internal calls
 * to Discord API without wrapping the `discord.js` implementation.
 *
 * Please notice that there is no Rate-Limit implementation,
 * we just expect that this call is not being abused by themselves. 🫂
 */
export class APIWrapper {
  private token: string
  private clientId: string
  private baseURL: string

  public constructor(token: string, clientId: string) {
    this.token = token
    this.clientId = clientId

    this.baseURL = 'https://discord.com/api/v9'
  }

  // TODO: Add type
  public async bulkOverwriteGuildApplicationCommands(
    payload: any,
    guildId: string,
  ) {
    return await this.request(
      `/applications/${this.clientId}/guilds/${guildId}/commands`,
      payload,
      'PUT',
    )
  }

  // TODO: Add type
  public async bulkOverwriteGlobalApplicationCommands(payload: any) {
    return await this.request(
      `/applications/${this.clientId}/commands`,
      payload,
      'PUT',
    )
  }

  private async request(
    url: string,
    body: Record<string, unknown>,
    method: Method = 'GET',
  ) {
    const requestURL = `${this.baseURL}${url}`
    const result = await got(requestURL, {
      method: method,
      json: body ?? undefined,
      headers: {
        Authorization: `Bot ${this.token}`,
        'Content-Type': 'application/json',
        'user-agent': 'sib/Lunawork (github/siberianmh/lunawork)',
      },
    })

    if (result.statusCode < 200 || result.statusCode >= 400) {
      throw result
    }

    return result
  }
}
