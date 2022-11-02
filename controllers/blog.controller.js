const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Blog  = require('../models/blog.model')
const User =  require('../models/user.model')

async function createBlog(req,res, next){
    const content = req.body

    const user = await User.findById(content.userId)

    const blog = new Blog({
        title: content.title,
        description: content.description,
        body: content.body,
        author: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()

    res.status(201).json({
        message: "Blog saved successfully",
        savedBlog
    })
}

module.exports = {
    createBlog
}