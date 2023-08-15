import mongoose from "mongoose";
import { color } from "../functions";
import {MONGO_URI, MONGO_DATABASE_NAME} from "../config.json";
module.exports = () => {
    const MONGO_URIi = MONGO_URI
    if (!MONGO_URI) return console.log(color("text",`🍃 Mongo URI not found, ${color("error", "skipping.")}`))
    mongoose.connect(`${MONGO_URIi}/${MONGO_DATABASE_NAME}`)
    .then(() => console.log(color("text",`🍃 MongoDB connection has been ${color("variable", "established.")}`)))
    .catch(() => console.log(color("text",`🍃 MongoDB connection has been ${color("error", "failed.")}`)))
}