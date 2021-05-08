import { LunaworkClient } from '../lunawork-client'
import { Interaction } from 'discord.js'
import { listener } from '../listener/decorator'
import { Stage } from '../stage'

export class InteractionsWrapperStage extends Stage {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  @listener({ event: 'interaction' })
  public async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isCommand()) {
      return
    }

    if (interaction.commandName === 'echo') {
      interaction.reply('msg')
    }
  }
}
