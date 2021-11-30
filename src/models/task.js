const mongoose = require('mongoose');

const taskSchema=new mongoose.Schema(
    {
        desc:{
            type:String,
            required:true
        },
        status:{
            type:String,
            default:false
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    },{
        timestamps:true
    }
)

const task=mongoose.model('Task',taskSchema)

module.exports=task