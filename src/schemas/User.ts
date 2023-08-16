import {Schema, model} from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema<IUser>({
    userID: {required: true, type: String},
    userData: {link: String, description: String, paid: {type: Boolean, default: false}}
})

const UserModel = model("Users", UserSchema)

export default UserModel