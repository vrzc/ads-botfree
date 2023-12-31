import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js"
import mongoose from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder,
    execute: (interaction : ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

interface GuildOptions {
    prefix: string,
}

interface userData {
    link: string,
    description: string,
    paid: boolean
}

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

export interface IUser extends mongoose.Document {
    userID: string,
    userData: userData,
}

export type GuildOption = keyof GuildOptions
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}


declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}

export interface Embed {
    title?: string,
    url?: string,
    author?: { name: string, icon_url?: string, url?: string},
    description?: string,
    thumbnail?: { url: string },
    fields?: [...{name: string, value: string}],
    image?: { url: string },
    timestamp?: (undefined | string),
    footer?: {text: string, icon_url?: string}
}

export interface Timer {
    timer: number,
    callback: () => void
}