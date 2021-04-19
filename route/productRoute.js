const express = require('express')
const { postProduct, productList, ProductById, read, deleteProduct, updateProduct } = require('../controller/product')
const { productValidation } = require('../validation')
const router = express.Router()

router.post('/postproduct', productValidation, postProduct)
router.get('/productlist', productList)
router.param('productId', ProductById)
router.get('/singleproduct/:productId', read)
router.delete('/deleteproduct/:productId', deleteProduct)
router.put('/updateproduct/:productId', updateProduct)

module.exports = router