const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Blog  = require('../models/blog.model')
const User =  require('../models/user.model');

//for reading time
const Utils =  require('../utils/utils')


async function createBlog(req,res, next){
    const content = req.body

    const blog = new Blog({
        title: content.title,
        description: content.description,
        body: content.body,
        tags: content.tags ,
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
            "state": "false",
            "error": "Blog Titles must be unique"
        })
    }

    
}

async function getBlogs(req,res,next){

    const limit = 20 ;
    const page = +req.query.page || 1;
    const skip = limit * (page - 1);
    const blogs =  await Blog.find({state: 'published', author: req.findFilter.author}).skip(skip).limit(limit);

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
    if (blog.state != 'published'){
        return res.status(403).json({
            status: false,
            error: 'Requested article is not published'
        })
    }
    blog.read_count +=1
    await blog.save()
    return res.status(200).json(blog)
}

async function deleteBlog(req,res,next){
    const user = req.user
    const id = req.params.id
    try{
        const blog = await Blog.findById(id)
        if (user.id == blog.author){
            await Blog.deleteOne({_id : id})
            return res.status(200).json({
                state: "true",
                message: "Blog deleted successfully"
            })
        }else{
            return res.status(403).json({
                state: "false",
                message: "You're not authorized to perform this action"
            })
        }

    }catch(err){
        console.log(err)
        return res.status(403).json({
            state: "false",
            message: "Blog not found"
        })
    }
    

}

async function updateBlog(req,res,next){
    const user = req.user
    const id = req.params.id
    const newBlog = req.body
    try{
        const blog = await Blog.findById(id)
        if (user.id == blog.author){
            await Blog.findByIdAndUpdate(id, newBlog, { new: true })
            return res.status(200).json({
                state: "true",
                message: "Blog updated successfully"
            })
        }else{
            return res.status(403).json({
                state: "false",
                message: "You're not authorized to perform this action"
            })
        }

    }catch(err){
        return res.status(403).json({
            state: "false",
            message: "Blog not found"
        })
    }
}

async function getUserBlog(req,res){
    try{
        const limit = 20 || 100;
        const page = +req.query.page || 1;
        const skip = limit * (page - 1);
        if (!req.query.state){
            const blogs =  await Blog.find({ author: req.user.id }).skip(skip).limit(limit)
            if (!blogs){
                return res.status(404).json({
                    status: "false",
                    message: "Blogs not found"
                })
            }
            return res.status(200).json({
                status: "true",
                blogs
            })
        }
        const blogs =  await Blog.find({ author: req.user.id , state: req.query.state}).skip(skip).limit(limit)
        if (!blogs){
            return res.status(404).json({
                status: "false",
                message: "Blogs not found"
            })
        }
        return res.status(200).json({
            status: "true",
            blogs
        })
    }catch(error){
        return res.status(404).json({
            status: "false",
            message: "Internal Server Error"
        })

    }
    
}
module.exports = {
    createBlog,
    getBlogs,
    getOneBlog,
    deleteBlog,
    updateBlog,
    getUserBlog
}