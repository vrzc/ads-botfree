import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageComponentBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, Embed, } from "../types";
import {oneprice, twoprice } from "../config.json"
const AdvertCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("create")
        .addStringOption(option => {
            return option
              .setName("package")
              .setDescription("Choose a package")
              .setRequired(true)
              .setChoices({
                name: "First Package",
                value: oneprice.price.toString()
              }, {
                name: "Second Package",
                value: twoprice.price.toString()
              })
          }).setDescription("What a nice choice"),
    cooldown: 10,
    execute: async interaction => {
        let choice = interaction.options.getString('package')
        let packageDescription;
        switch(choice) {
            case oneprice.price.toString():
                packageDescription = oneprice?.description
                break;
            case twoprice.price.toString():
                packageDescription = twoprice?.description
                break;
        }
        
        console.log(packageDescription, oneprice)
        let mainEmbed: Embed = {
            title: "Guild Advert",
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.displayAvatarURL(),
            },
            description: 'Start Advertising your Guild NOW',
            fields: [{
                name: "Package Type",
                value: choice
            },
                {
                name: "Costs",
                value: (parseInt(choice?.replace('k', '') || "0") * 1000) * (1 + (5/100))
            }, {
                name: "Package Description",
                value: packageDescription || "No Description was specified"
            }],
            timestamp: new Date().toISOString(),
            thumbnail: {url: interaction.guild?.iconURL() as string}
        };

        let actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('main')
            .setLabel("Start!")
            .setStyle(ButtonStyle.Success)
        )
        interaction.reply({ embeds: [mainEmbed], components: [actionRow as any ]}); // Any Cuz types are crazy when it comes to "types"
    }
}

export default AdvertCommand;
