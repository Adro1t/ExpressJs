const express = require('express')
const { getHello, postCategory, getAllCategory } = require('../controller/category')
const router = express.Router()

router.get('/hello', getHello)
router.post('/postcategory',postCategory)
router.get('/categorylist',getAllCategory)

module.exports=router