import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageComponentBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, Embed } from "../types";

const AdvertCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Starts the process for the guild advertisement!"),
    execute: async interaction => {
        let mainEmbed: Embed = {
            title: "Guild Advert",
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.displayAvatarURL(),
            },
            description: 'Start Advertising your Guild NOW',
            timestamp: new Date().toISOString()
        };

        let actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('main')
            .setLabel("Start!")
            .setStyle(ButtonStyle.Success)
        )
        interaction.reply({ embeds: [mainEmbed], components: [actionRow as any ] }); // Any Cuz types are crazy when it comes to "types"
    }
}

export default AdvertCommand;
