const express = require('express')
const { getHello, postCategory, getAllCategory, CategoryById, getsingleCategory, deleteCategory, updateCategory } = require('../controller/category')
const router = express.Router()
const { userById, requireSignin, isAdmin } = require('../controller/user')

router.get('/hello', getHello)
router.post('/postcategory/:userId', requireSignin, isAdmin, postCategory)
router.get('/categorylist', getAllCategory)
router.param('categoryId', CategoryById)
router.get('/read/:categoryId', getsingleCategory)
router.delete('/deletecategory/:categoryId', deleteCategory)
router.put('/updatecategory/:categoryId', updateCategory)

router.param('userId', userById)

module.exports = router