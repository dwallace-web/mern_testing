require('dotenv').config()
console.log(process.env.HELLO_MESSAGE)

const express = require('express');
const colors = require('colors');
const port = process.env.PORT;

const {errorHandler} = require('./middleware/error_handling')
const connectdb = require('./config/db')
const app = express();


connectdb(); 

//middle ware to process the body
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/goals', require('./routes/goal_routing'))
app.use('/api/users', require('./routes/user_routing'))

//overwrite the default express error handling
app.use(errorHandler)

app.listen(port, (  console.log(`server on ${port}`)))