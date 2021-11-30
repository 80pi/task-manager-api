const express = require('express')
require('./src/db/mongoose')

const userRoute=require("./src/routes/user")
const taskRoute=require("./src/routes/task")


const app = express()
const port = process.env.PORT

// example for middle how it is working
// below example tells that it will block all req methods use this while maintance if can apply this method
// in which can can specify a particular path like this 

// app.use((req,res,next)=>{
//     if(req.method==="GET"){
//         res.send('under maintance')
//     }else{
//         next()
//     }
//     })

// below once is to block all methods of request

// app.use((req,res,next)=>{
//     res.send('under maintance')
// })

app.use(express.json())
app.use(userRoute)
app.use(taskRoute)


// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, () => console.log('at ',port))



