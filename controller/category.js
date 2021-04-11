
const Category=require('../model/categoryModel')

exports.getHello=(req,res)=>{
    res.send('Hello World')
}

exports.postCategory=(req,res)=>{
    //agadi ko request paxadi ko response
    let category=new Category(req.body)
    category.save((error,category)=>{
        if(error || !category){
            return res.status(400).json({error:"Something went wrong"})
        }
        res.json({category})
    })
}


exports.getAllCategory=(req,res)=>{
    Category.find().exec((error,category)=>{
        if(error || !category){
            return res.status(400).json({error:"Category not found"})
        }
        res.json(category)
    })
}