const express = require('express');
const TaskModel=require('../models/task')
const auth = require('../middleware/auth');
const app=new express.Router()


app.post('/task',auth, async (req, res) => {
    
    const data=new TaskModel({
        ...req.body,
        owner:req.user._id
    })
    try {
        await data.save()
        res.send(data)
        
    } catch (e) {
        res.status(400).send()
    }
    
})


// for this we had added the search of
// /GET/?status=true
// now the limit and skip limit =how many to display skip =to skip how many and display be like
// /GET?limit=n&skip=n


app.get('/task',auth, async(req,res)=>{
    const match={}
    const sort={}

    if(req.query.status){
        match.status=req.query.status==='true'
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(":")
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try {
        // method 1

        // const dd= await TaskModel.find({owner:req.user._id})
        // if(!dd){
        //     res.status(400).send(e)
        // }
        // res.send(dd)

        // method2
        // with out any query of true or false we are using below
        // await req.user.populate('tasks')

        // based on match be
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)        
    } catch (e) {
        res.status(500).send(e)
    }
    // UserModel.find({}).then(i=>res.send(i)).catch(e=>res.status(500).send())
})

app.patch('/task/:id',auth,async(req,res)=>{
        const updateObj=Object.keys(req.body)
        const allowedKeys=['desc','status']
        const isValid=updateObj.every(i=>allowedKeys.includes(i))
        if(!isValid){
            res.status(404).send({"error":"invalid body"})
        }
        try {
            // while using the middle wares in the model we canot update our patch for that we need to change this line refactioring
        //   const dd=await TaskModel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}) // in which this line is with out auth
            const dd=await TaskModel.findOne({_id:req.params.id,owner:req.user._id})
          if(!dd){
           return res.status(500).send({error:'wrong user'})   
          }
          updateObj.forEach(i=>dd[i]=req.body[i])
          await dd.save()
          res.send(dd) 
        } catch (error) {
            res.status(404).send(error)
        }
    
    })


    app.delete('/task/:id',auth,async(req,res)=>{
            try {
                const dd= await TaskModel.findOneAndDelete({_id:req.params.id,owner:req.user._id})
                if(!dd){
                    return res.status(404).send({'error':"not in db"})
                }
                res.send(dd)
            } catch (error) {
                res.status(500).send(error)
            }
        })
  
    

    

module.exports=app