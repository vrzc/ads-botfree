import { Schema, model } from "mongoose";
import { IGuild } from "../types";
import {PREFIX} from "../config.json";
const GuildSchema = new Schema<IGuild>({
    guildID: {required:true, type: String},
    options: {
        prefix: {type: String, default: PREFIX}
    }
})

const GuildModel = model("guild", GuildSchema)

export default GuildModel