import { ChannelType, GuildMember, Message } from "discord.js";
import { checkPermissions, getGuildOption, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";
import { PREFIX } from "../config.json"
const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        if (!message.member || message.member.user.bot) return;
        if (!message.guild) return;
        let prefix = PREFIX
        if (mongoose.connection.readyState === 1) {
            let guildPrefix = await getGuildOption(message.guild, "prefix") 
                if (guildPrefix) prefix = guildPrefix;
        }
        if(message.channel.id === '1140895340229308426') {
            const filter = (res: Message): boolean => res.author.id == '282859044593598464' && res.content == `**:moneybag: | ${(message.guild?.members.cache.get(message.author.id) as GuildMember).user.username}, has transferred \`$950\` to <@!642513832270626817> **`
            message.channel.awaitMessages({ filter , max: 1, time: 240000, errors: ['time']}).then(colct => {

            })
        }

        if (!message.content.startsWith(prefix)) return;
        if (message.channel.type !== ChannelType.GuildText) return;

        let args = message.content.substring(prefix.length).split(" ")
        let command = message.client.commands.get(args[0])

        if (!command) {
            let commandFromAlias = message.client.commands.find((command) => command.aliases.includes(args[0]))
            if (commandFromAlias) command = commandFromAlias
            else return;
        }

        let cooldown = message.client.cooldowns.get(`${command.name}-${message.member.user.username}`)
        let neededPermissions = checkPermissions(message.member, command.permissions)
        if (neededPermissions !== null)
            return sendTimedMessage(
                `
            You don't have enough permissions to use this command. 
            \n Needed permissions: ${neededPermissions.join(", ")}
            `,
                message.channel,
                5000
            )


        if (command.cooldown && cooldown) {
            if (Date.now() < cooldown) {
                sendTimedMessage(
                    `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`,
                    message.channel,
                    5000
                )
                return
            }
            message.client.cooldowns.set(`${command.name}-${message.member.user.username}`, Date.now() + command.cooldown * 1000)
            setTimeout(() => {
                message.client.cooldowns.delete(`${command?.name}-${message.member?.user.username}`)
            }, command.cooldown * 1000)
        } else if (command.cooldown && !cooldown) {
            message.client.cooldowns.set(`${command.name}-${message.member.user.username}`, Date.now() + command.cooldown * 1000)
        }

        command.execute(message, args)
    }
}

export default event