import { LunaworkClient } from '../lunawork-client'
import { wsListener } from '../websocket/decorator'
import { Stage } from '../stage'
import { InteractionTypes } from '../../djs-extend/types'
import { CommandInteraction } from '../../djs-extend/command-interaction'

export class InteractionsWrapperStage extends Stage {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  // @ts-expect-error
  @wsListener({ event: 'INTERACTION_CREATE' })
  public async onInteractionCreate(data: any) {
    if (data.type === InteractionTypes.APPLICATION_COMMAND) {
      const interaction = new CommandInteraction(this.client, data)

      this.client.emit('interaction', interaction)
    }
  }
}
