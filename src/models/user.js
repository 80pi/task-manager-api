const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const TaskModel=require('../models/task')
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
    },
    age:{
        type: Number,
        default:0
    },
    email:{
        type: String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(! validator.isEmail(value)){
                throw new Error('Invalid email formate')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
           
            if(value.toLowerCase().includes('password')){
                throw new Error('it includes teh word password')
            }  
            }
        },
        tokens:[{
            token:{
                type: String,
                required: true,
            }
        }],
        avatar:{
            type:Buffer
        }
    },{
        timestamps:true
    })


userSchema.virtual('tasks',{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
})

userSchema.methods.getPublicProfile=function(){
    const user=this
    const userObj=user.toObject()

    delete userObj.password
    delete userObj.tokens
    return userObj
}

userSchema.methods.generateAuthToken= async function(){
    const use=this
    const token=jwt.sign({_id:use._id.toString()},process.env.JWT_SECREAT_TOKEN)
    use.tokens=use.tokens.concat({token})
    await use.save()
    return token
}

userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}

userSchema.pre('save',async function(next){
    const use=this
    if(use.isModified('password')){
        use.password=await bcrypt.hash(use.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const use=this
    await TaskModel.deleteMany({owner:use._id})
    next()
})

const User= mongoose.model('User',userSchema)


module.exports=User