const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Blog  = require('../models/blog.model')
const User =  require('../models/user.model');

//for reading time
const readingTime =  require('../utils/utils')

const { query } = require('express');

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
    try{
        // fix: expired token error showing for all types of errors
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodedToken){
            return res.status.json({error: 'Invalid or Missing Token'})
        }
        const user = await User.findById(decodedToken.user._id)
    
    
        const blog = new Blog({
            title: content.title,
            description: content.description,
            body: content.body,
            tags: content.tag || '',
            author: user._id,
            reading_time: readingTime(content.body)
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
        
    }catch(error){
        return res.status(401).json({
            error: "Token expired. Please try to Log In again"
        })
    }
    
    

    
}

async function getBlogs(req,res,next){

    
    // on hold
    
    Blog.find()
        .then(blogs =>{
            if (!req.query.page) {
                req.query.page = 1
            }
            const page = req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 100;
            const skip = (page - 1) * limit;
            blogs = blogs.skip(skip).limit(limit);

            const pageLength = orders.reduce((acc, cur) => (acc += 1), 0);
            return res.json({ status: 'success', pageLength, blogs });
        })
        .catch(err =>{
            return err
        })

}

async function getOneBlog(req,res,next){
    const id = req.params.id
    const blog = await Blog.findById(id)
    if (!blog){
        return res.status(404).json({
            message: "Blog Not Found"
        })
    }
    blog.read_count +=1
    await blog.save()
    return res.status(200).json(blog)
}
module.exports = {
    createBlog,
    getBlogs,
    getOneBlog
}