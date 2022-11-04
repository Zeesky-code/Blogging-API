const express = require('express');
const blogRouter = express.Router()

const auth =  require('../middlewares/auth')
const blogController = require('../controllers/blog.controller')

blogRouter.post('/create', auth.protect,blogController.createBlog)
blogRouter.get('/', blogController.getBlogs)
blogRouter.get('/:id', blogController.getOneBlog)
blogRouter.delete('/:id',auth.protect, blogController.deleteBlog)
blogRouter.put('/:id', auth.protect, blogController.updateBlog)


module.exports = blogRouter