const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Blog  = require('../models/blog.model')
const User =  require('../models/user.model')

const getTokenFrom =  req =>{
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.substring(7)
    }
    return null
}

async function createBlog(req,res, next){
    const content = req.body

    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!decodedToken){
        return res.status.json({error: 'Invalid or Missing Token'})
    }
    const user = await User.findById(decodedToken.user._id)


    const blog = new Blog({
        title: content.title,
        description: content.description,
        body: content.body,
        author: user._id
    })
    try{
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.status(201).json({
            message: "Blog saved successfully",
            savedBlog
        })
    }catch{
        res.status(400).json({
            "error": "Blog Titles must be unique"
        })
    }
    

    
}

module.exports = {
    createBlog
}