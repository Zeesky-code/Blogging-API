const express = require('express');
const blogRouter = express.Router()


const blogController = require('../controllers/blog.controller')

blogRouter.post('/create', blogController.createBlog)
blogRouter.get('/', blogController.getBlogs)
blogRouter.get('/:id', blogController.getOneBlog)


module.exports = blogRouter