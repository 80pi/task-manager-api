const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User=require('../../src/models/user')
const Task=require('../../src/models/task')


const userOneId=new mongoose.Types.ObjectId()
const userTwoId=new mongoose.Types.ObjectId()
const userOne={
    _id: userOneId,
    name:"gopi",
    email:"gopi12@gmail.com",
    password:"gopiajay",
    tokens:[{
        token: jwt.sign({_id:userOneId},process.env.JWT_SECREAT_TOKEN)
    }]
}
const userTwo={
    _id: userTwoId,
    name:"ajay",
    email:"ajay@gmail.com",
    password:"gopiajay",
    tokens:[{
        token: jwt.sign({_id:userTwoId},process.env.JWT_SECREAT_TOKEN)
    }]
}

const taskOne={
    _id:new mongoose.Types.ObjectId(),
    desc:"one",
    owner: userOne._id
}
const taskTwo={
    _id:new mongoose.Types.ObjectId(),
    desc:"two",
    owner:userOne._id
}
const taskThree={
    _id:new mongoose.Types.ObjectId(),
    desc:"three",
    owner:userTwo._id
    
}


const resetDb=async()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports={
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    resetDb,

}