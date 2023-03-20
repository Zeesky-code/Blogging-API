const passport = require('passport');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
require('dotenv').config();

const Blog = require('../models/blog.model')



//for reading time
const Utils = require('../utils/utils')


async function createBlog(req, res, next) {
    const content = req.body

    const blog = new Blog({
        title: content.title,
        description: content.description,
        body: content.body,
        tags: content.tags,
        author: req.user._id,
        reading_time: Utils.readingTime(content.body)
    })
    try {
        const savedBlog = await blog.save()
        req.user.blogs = req.user.blogs.concat(savedBlog._id)
        await req.user.save()
        res.status(201).json({
            message: "Blog saved successfully",
            savedBlog
        })
        
    } catch {
        res.status(400).json({
            "state": "false",
            "error": "Blog Titles must be unique"
        })
    }


}

async function getBlogs(req, res, next) {
    try {
        const { page, sortBy, search, orderBy = 'asc' } = req.query
        orderBy === "desc" ? orderIndex = -1 : orderIndex = 1
        const limit = 20
        const skip = (page - 1) * limit

        if (sortBy == 'timestamp') {
            const blog = await Blog
            .find({ state: 'published' }).limit(limit).skip(skip).sort({ createdAt: orderIndex })
            return res.status(200).send(blog)
        }
        if (sortBy == 'reading_time') {
            const blog = await Blog
            .find({ state: 'published' }).limit(limit).skip(skip).sort({ reading_time: orderIndex })
            return res.status(200).send(blog)
        }
        if (sortBy == 'read_count') {
            const blog = await Blog
            .find({ state: 'published' }).limit(limit).skip(skip).sort({ read_count: orderIndex })
            return res.status(200).send(blog)
        }
        if (search) {

            const blog = await Blog
            .find({ state: 'published' }).and({
                $or: [
                    {
                        title: { $regex: search, $options: "i" },
                    },
                    {
                        author: { $regex: search, $options: "i" },
                    },
                    {
                        tags: { $regex: search, $options: "i" },
                    }
                ],
            }).limit(limit).skip(skip)
            return res.status(200).json({
                status: "true",
                blog
            })
        }
        const blog = await Blog
        .find({ state: 'published' }).limit(limit).skip(skip)
        logger.info(`Blogs ${blog} accessed`)
        return res.status(200).json({ status: "true", blog })
        


    } catch (error) {
        logger.error(`Error: ${error} when trying to get all blogs`)
        return res.status(404).json({
            status: "false",
            message: "Blog not Found"
        })
    }

}

async function getOneBlog(req, res, next) {
    const id = req.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
        return res.status(404).json({
            message: "Blog Not Found"
        })
    }
    if (blog.state != 'published') {
        return res.status(403).json({
            status: false,
            error: 'Requested article is not published'
        })
    }
    blog.read_count += 1
    await blog.save()
    return res.status(200).json(blog)
}

async function deleteBlog(req, res, next) {
    const user = req.user
    const id = req.params.id
    try {
        const blog = await Blog.findById(id)
        if (user.id == blog.author) {
            await Blog.deleteOne({ _id: id })
            return res.status(200).json({
                state: "true",
                message: "Blog deleted successfully"
            })
        } else {
            return res.status(403).json({
                state: "false",
                message: "You're not authorized to perform this action"
            })
        }

    } catch (err) {
        logger.error(`Error: ${err} when trying to get delete a blog by ${user}`)
        return res.status(404).json({
            state: "false",
            message: "Blog not found"
        })
    }
}

async function updateBlog(req, res, next) {
    const user = req.user
    const id = req.params.id
    const newBlog = req.body
    try {
        const blog = await Blog.findById(id)
        if (user.id == blog.author) {
            await Blog.findByIdAndUpdate(id, newBlog, { new: true })
            return res.status(201).json({
                state: "true",
                message: "Blog updated successfully"
            })
        } else {
            return res.status(403).json({
                state: "false",
                message: "You're not authorized to perform this action"
            })
        }

    } catch (err) {
        logger.error(`Error: ${err} when trying to get update a blog by ${user}`)
        return res.status(403).json({
            state: "false",
            message: "Blog not found"
        })
    }
}

async function getUserBlog(req, res) {
    try {
        const limit = 20 || 100;
        const page = +req.query.page || 1;
        const skip = limit * (page - 1);
        if (!req.query.state) {
            const blogs = await Blog.find({ author: req.user.id }).skip(skip).limit(limit)
            if (!blogs) {
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
        const blogs = await Blog.find({ author: req.user.id, state: req.query.state }).skip(skip).limit(limit)
        if (!blogs) {
            return res.status(404).json({
                status: "false",
                message: "Blogs not found"
            })
        }
        return res.status(200).json({
            status: "true",
            blogs
        })
    } catch (error) {
        logger.error(`Error: ${error} when trying to get get a user's blog by ${user}`)
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