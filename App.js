
const express = require('express')
require('dotenv').config()
const db=require('./db/connection')
const bodyParser=require('body-parser')
const morgan=require('morgan')

const CategoryRoute=require('./route/CategoryRoute')

const app = express()

//middleware
app.use(bodyParser.json())//to handle json data bodyParser is needed
app.use(morgan('dev'))//for development purposes

//route
app.use('/api',CategoryRoute)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})