import {
  APIMessage,
  Client,
  MessageAdditions,
  Snowflake,
  WebhookClient,
} from 'discord.js'
import fetch from 'node-fetch'
import { Interaction } from './interaction'
import { InteractionResponseTypes } from './types'

export class CommandInteraction extends Interaction {
  public commandID: Snowflake
  public commandName: string
  public deferred: boolean
  public options: any
  public replied: boolean
  public webhook: WebhookClient

  public constructor(client: Client, data: any) {
    super(client, data)

    /**
     * The ID of the invoked application command
     */
    this.commandID = data.data.id

    /**
     * The name of the invoked application command
     */
    this.commandName = data.data.name

    /**
     * Whether the reply to this interaction has been deferred
     */
    this.deferred = false

    // /**
    //  * The options passed to the command.
    //  */
    // this.options =
    //   data.data.options?.map((o) =>
    //     this.transformOption(o, data.data.resolved),
    //   ) ?? []

    /**
     * Whether this interaction has already been replied to
     */
    this.replied = false

    /**
     * An associated webhook client, can be used to create deferred replies
     */
    this.webhook = new WebhookClient(
      data.application_id,
      data.token,
      this.client.options,
    )
  }

  public async reply(
    content: string | APIMessage | MessageAdditions,
    options?: any,
  ) {
    const apiMessage =
      content instanceof APIMessage
        ? content
        : // @ts-expect-error
          APIMessage.create(this, content, options)
    const { data } = await apiMessage.resolveData().resolveFiles()

    const body = {
      type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
      data,
    }

    await fetch(
      `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`,
      {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    this.replied = true
  }
}
