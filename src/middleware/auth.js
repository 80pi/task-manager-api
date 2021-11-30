const jwt = require('jsonwebtoken');
const User=require('../models/user')
// const Task=require('../models/task')

const auth= async(req,res,next)=>{
    try {
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.JWT_SECREAT_TOKEN)
        const user=await User.findOne({_id:decode._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()

    } catch (e) {
        res.status(404).send({error:'please provide authorization'})
    }
}

module.exports=auth