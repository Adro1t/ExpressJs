
const express = require('express')
require('dotenv').config()
const db = require('./db/connection')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')

const CategoryRoute = require('./route/categoryRoute')
const ProductRoute = require('./route/productRoute')
const UserRoute = require('./route/userRoute')
const OrderRoute = require('./route/orderRoute')

const app = express()

//middleware
app.use(bodyParser.json())//to handle json data bodyParser is needed
app.use(morgan('dev'))//for development purposes
app.use(expressValidator())
app.use(cookieParser())

//route
app.use('/api', CategoryRoute)
app.use('/api', ProductRoute)
app.use('/api', UserRoute)
app.use('/api', OrderRoute)


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})