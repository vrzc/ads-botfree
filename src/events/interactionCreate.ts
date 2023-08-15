import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, Interaction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { BotEvent, Embed } from "../types";

const event : BotEvent = {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            let command = interaction.client.slashCommands.get(interaction.commandName)
            let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`)
            if (!command) return;
            if (command.cooldown && cooldown) {
                if (Date.now() < cooldown) {
                    interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`)
                    setTimeout(() => interaction.deleteReply(), 5000)
                    return
                }
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
                setTimeout(() => {
                    interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`)
                }, command.cooldown * 1000)
            } else if (command.cooldown && !cooldown) {
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
            }
            command.execute(interaction)
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                if(!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if(interaction.isButton()) {
            if(interaction.customId == 'main') {
                let mainComponent = new ModalBuilder().setCustomId('mainmodal').setTitle("Advert Customization");
                const advertLink = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('link').setLabel("Your Advert URL").setPlaceholder("https://discord.gg/invLINK | https://youtube.com/rickroll").setStyle(TextInputStyle.Short));
                const advertDescription = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('description').setLabel("Your Advert Description").setPlaceholder("Hallo Guys this is my really cool server! plz join").setStyle(TextInputStyle.Paragraph));
                mainComponent.addComponents(advertLink as any, advertDescription) // any for useless types!
                await interaction.showModal(mainComponent)
            } else if(interaction.customId == 'accept') {
                let acceptslashdecline = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('acceptoffer').setLabel('Accept').setStyle(ButtonStyle.Success)
                ).addComponents(
                    new ButtonBuilder().setCustomId('declineoffer').setLabel('Decline').setStyle(ButtonStyle.Danger)
                )
                let mainChannel = interaction.client.channels.cache.get('1140877841416847380') as TextChannel
                mainChannel.send({embeds: [interaction.message.embeds[0]], components: [acceptslashdecline as any]}) // Again :/
            } else if(interaction.customId == 'acceptoffer') {
                let channelLink = (interaction.guild?.channels.cache.get('1140877947197210694') as TextChannel).createInvite()
                let mainUser = interaction.guild?.members.cache.get(interaction.message.embeds[0].footer?.text as any) as GuildMember
                mainUser.send({content: `${mainUser}, Please pay for your advert! **discord.gg/${(await channelLink).code}** By clicking "joined" it'll redirect you to the paying channel`}) // This automatically redirects them to the paying channel!
                interaction.reply({content: "The user will be notified soon.", embeds: [], components: []})
                // ;(await interaction.channel?.messages.fetch(interaction.message.url))?.edit({ content: "The user will be notified soon!", embeds: [], components: []})
            }
        }
        if(interaction.isModalSubmit()) {
            if(interaction.customId == 'mainmodal') {
                let mainEmbed: Embed = {
                    title: interaction.user.username + " Submission",
                    fields: [{name: 'Advert Link', value: "`" + interaction.fields.getTextInputValue('link') + "`"}, {name: 'Advert Description', value: "`" + interaction.fields.getTextInputValue('description') + "`"}],
                    timestamp: new Date().toISOString(),
                    footer: {text: interaction.user.id}
                }
                let mainButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId("accept").setLabel("Send").setStyle(ButtonStyle.Success)
                ).addComponents(
                    new ButtonBuilder().setCustomId('decline').setLabel('Redo').setStyle(ButtonStyle.Danger)
                )
                await interaction.reply({ ephemeral: true, embeds: [mainEmbed], components: [mainButtons as any]}) // Any again cuz ts types is crazy !
                setTimeout(async() => {
                    await interaction.editReply({content: "Your Submission has been sent!", embeds: [], components: []})
                }, 2000)
            }
        }
    }
}

export default event;