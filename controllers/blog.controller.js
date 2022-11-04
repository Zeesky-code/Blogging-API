const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Blog  = require('../models/blog.model')
const User =  require('../models/user.model');

//for reading time
const Utils =  require('../utils/utils')

const { query } = require('express');
const { VirtualType } = require('mongoose');



async function createBlog(req,res, next){
    const content = req.body

    
    const blog = new Blog({
        title: content.title,
        description: content.description,
        body: content.body,
        tags: content.tag ,
        author: req.user._id,
        reading_time: Utils.readingTime(content.body)
    })
    try{
        const savedBlog = await blog.save()
        req.user.blogs = req.user.blogs.concat(savedBlog._id)
        await req.user.save()
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

async function getBlogs(req,res,next){

    const limit = +req.query.limit || 100;
    const page = +req.query.page || 1;
    const skip = limit * (page - 1);
    const blogs =  await Blog.find({state: 'published'}).skip(skip).limit(limit);

    // on hold
    return res.status(200).json({
        blogs
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

async function updateBlog(req,res,next){

}
module.exports = {
    createBlog,
    getBlogs,
    getOneBlog
}