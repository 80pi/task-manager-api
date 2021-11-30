const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_URL,{useNewUrlParser:true})

// const me=new User({
//     name:'gva',
//     age:-1,
//     password:'   l rftg    '
// })

// me.save().then(i=>console.log(i)).catch(e=>console.log(e))


// old method to discuss to mongodb be
// mongoCli.connect('mongodb://127.0.0.1:27017',{useNewUrlParser:true},(err,res)=>{
//     if(err){
//         return console.log('error')
//     }
//     const db=res.db('task-manager')

    // insert one and inset many
    // db.collection('users').insertOne({name:'go',age:29},(err,result)=>{
    //     if(err){
    //         console.log('error to insert')
    //     }
    //     console.log(result)
    // })

    // challange 
    // db.collection('tasks').insertMany([{desc:'gg',status:'true'},{desc:'glo',status:'false'},{desc:'asa',status:'true'}],(err,result)=>{
    //     if(err){
    //         return console.log('unable o conn')
    //     }
    //     console.log(result.insertedCount)
    // })

    // find one
    // db.collection('users').findOne({age:22},(err,resp)=>{
    //     if(err){
    //         return console.log('not there')
    //     }
    //     console.log(resp)
    // })

    // find to array
    // db.collection('users').find({age:22}).toArray((err,dd)=>{
    //     err?console.log('err'):console.log(dd)
    // })

    // // find count
    // db.collection('users').find({age:22}).count((err,dd)=>{
    //     err?console.log('err'):console.log(dd)
    // })


    // update one and update many
    // db.collection('users').updateOne({_id:new ObjectId('6193824a59916650e17631f3')},{$set:{name:'ajay'}}).then((res)=>console.log(res)).catch((err)=>console.log(err))
    // db.collection('users').updateOne({_id:new ObjectId('6193a1735a70a35da45ea1c3')},{$inc:{age:1}}).then((res)=>console.log(res)).catch((err)=>console.log(err))

    // db.collection('users').updateMany({age:23},{$inc:{age:-1}}).then((res)=>console.log(res)).catch((err)=>console.log(err))


    // delete onea nd delete many
    // db.collection('users').deleteOne({age:25}).then((res)=>console.log(res)).catch((err)=>console.log(err))
    // db.collection('users').deleteMany({age:22}).then((res)=>console.log(res)).catch((err)=>console.log(err))

    // model in mangoose