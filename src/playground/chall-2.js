require('../db/mongoose')
const User = require('../models/user');

// challange to find and delete by id in monoggose

// User.findByIdAndDelete('619642cf192b04a2099e4f39').then(i=>{
//     console.log(i)
//     return User.countDocuments({age:32})
// }).then(i2=>{
//     console.log(i2)
// }).catch(e=>{
//     console.log(e)
// })

const deleteId=async(id,age)=>{
    await User.findByIdAndDelete(id)
    const cou=await User.countDocuments({age})
    return cou
}

deleteId('619624478850a0e7d422826a',-1).then(i=>console.log(i)).catch(e=>console.log(e))