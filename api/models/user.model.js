import mongoose from "mongoose";
import { Schema } from "mongoose";

const skemaPengguna = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
    }
}, {timestamps:true})

const Pengguna = mongoose.model('Pengguna', skemaPengguna)

export default Pengguna