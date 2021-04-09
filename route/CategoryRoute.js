const express = require('express')
const { getHello, postCategory } = require('../controller/category')
const router = express.Router()

router.get('/hello', getHello)
router.post('/postcategory',postCategory)

module.exports=router