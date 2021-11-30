const express = require('express');
const UserModel=require('../models/user')
const auth=require('../middleware/auth')
const multer = require('multer');
const sharp = require('sharp');
const {sendNewUSerInvite,sendGoodByeEmail}=require('../emails/account')
const app=new express.Router()

const upload=multer({
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb('upload jpg|jpeg|png')
        }
        cb(undefined,true)
    }
})


app.post('/user', async (req, res) => {
    const data=new UserModel(req.body)
    try {
        await data.save()
        const token =await data.generateAuthToken()
        sendNewUSerInvite(data.email,data.name)
        res.status(201).send({data,token})
    } catch (e) {
        res.status(400).send(e)
    }

    // used try catch block
    // const token =await data.generateAuthToken()
    // data.save().then(i=>{
    //     res.status(201).send({i,token})
    // }).catch(e=>
    //     {
    //         res.status(400).send(e)
    //     })
})

app.get('/user/me',auth,async(req,res)=>{
    // the below will display all
    // res.send(req.user)

    // like directly we can wirte like this by definign individualy
    // res.send({_id:req.user._id,name:req.user.name,age:req.user.age,email:req.user.email})

    // we can send data like this or we cna create a instan function and we can send teh data 
    // by writitng the logic in models file 
    // instance method like this
    res.send({user:req.user.getPublicProfile()})
    
})


app.get('/user',async(req,res)=>{
    try {
        const dd= await UserModel.find({})
        res.send(dd)
        
    } catch (e) {
        res.status(400).send()
    }
    // UserModel.find({}).then(i=>res.send(i)).catch(e=>res.status(500).send())
})
app.get('/user/:age',async(req,res)=>{
    const _id=req.params.age
    try {
        const dd= await UserModel.findById({_id})
        res.send(dd)
        
    } catch (e) {
        res.status(400).send()
    }
    
    // with out async await below oen

    // UserModel.findById({_id}).then(i=>{if(!i){
    //     return res.status(404).send()
    // }
    // res.send(i)}).catch(e=>res.status(500).send())
})


// for updating based on id

// app.patch('/user/:id',async(req,res)=>{
//     const updateObj=Object.keys(req.body)
//     const allowedKeys=['name','age','password']
//     const isValid=updateObj.every(i=>allowedKeys.includes(i))
//     if(!isValid){
//         res.status(404).send({"error":"invalid body"})
//     }
//     try {
//         // while using the middle wares in the model we canot update our patch for that we need to change this line refactioring
//     //   const dd=await UserModel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}) 
//         const dd=await UserModel.findById(req.params.id)
//         updateObj.forEach(i=>dd[i]=req.body[i])
//         await dd.save()

//       if(!dd){
//        return res.status(500).send()   
//       }
//       res.send(dd) 
//     } catch (error) {
//         res.status(404).send(error)
//     }

// })

// update onyl his profile like loge i user update his profile
app.patch('/user/me',auth,async(req,res)=>{
    const updateObj=Object.keys(req.body)
    const allowedKeys=['name','age','password']
    const isValid=updateObj.every(i=>allowedKeys.includes(i))
    if(!isValid){
        res.status(404).send({"error":"invalid body"})
    }
    try {
        // while using the middle wares in the model we canot update our patch for that we need to change this line refactioring
    //   const dd=await UserModel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}) 
        
        updateObj.forEach(i=>req.user[i]=req.body[i])
        await req.user.save()
      res.send(req.user) 
    } catch (error) {
        res.status(404).send(error)
    }

})

// for deleting based on id
// app.delete('/user/:id',async(req,res)=>{
//     try {
//         const dd= await UserModel.findByIdAndDelete(req.params.id)
//         if(!dd){
//             return res.status(404).send({'error':"not in db"})
//         }
//         res.send(dd)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// deleting only loged in ur on his own

app.delete('/user/me',auth,async(req,res)=>{
    try {
        await req.user.remove()
        sendGoodByeEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})



// for loginign
app.post('/user/login', async(req,res)=>{
    try {
        const data=await UserModel.findByCredentials(req.body.email,req.body.password)
        const token =await data.generateAuthToken()
        res.send({user:data.getPublicProfile(),token})
    } catch (error) {
       res.status(400).send(error) 
    }
})


// this logout is only for one token only

app.post('/user/logout',auth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter(i=>{
            return(i.token!==req.token)
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(400).send(error) 
    }
})


// to logout fro all devices be

app.post('/user/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error) 
    }
})

app.post('/user/me/avatar',auth,upload.single('upload'),async(req,res)=>{
    const buffer= await sharp(req.file.buffer).resize({width:200,height:200}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(err,req,res,next)=>{
    res.status(400).send({error:err})
})

app.delete('/user/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

app.get('/user/:id/avatar',async(req,res)=>{
    try{
        const dd=await UserModel.findById(req.params.id)   
        
        if(!dd || !dd.avatar){
        throw new Error('no emp')
        }
        res.set('Content-Type','image/png')
        res.send(dd.avatar)

    }catch(e){
        res.status(404).send(e)
    }
})




module.exports=app