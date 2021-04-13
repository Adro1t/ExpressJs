
const Category = require('../model/categoryModel')

exports.getHello = (req, res) => {
    res.send('Hello World')
}

exports.postCategory = (req, res) => {
    //agadi ko request paxadi ko response
    let category = new Category(req.body)
    category.save((error, category) => {
        if (error || !category) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.json({ category })
    })
}


exports.getAllCategory = (req, res) => {
    Category.find().exec((error, category) => {
        if (error || !category) {
            return res.status(400).json({ error: "Category not found" })
        }
        res.json(category)
    })
}


//category by id
exports.CategoryById = (req, res, next, id) => {
    Category.findById(id).exec((error, category) => {
        if (error || !category) {
            return res.status(400).json({ error: "Category not found" })
        }
        req.category = category
        next()
    })

}

exports.getsingleCategory = (req, res) => {
    return res.json(req.category)
}


//to delete category
exports.deleteCategory=(req,res)=>{
    const category=req.category
    category.remove((error,result)=>{
        if(error || !result){
            return res.status(400).json({error:"Something went wrong"})
        }
        res.json({messsage:"Category deleted"})
    })
}