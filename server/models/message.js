import mongoose from "mongoose"

//schema
const messageSchema=mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    text:{type:String},
    image:{type:String},
    seen:{type:Boolean,default:false}
},{timestamps:true})

//model

const Message=mongoose.model("Message",messageSchema)

export default Message;