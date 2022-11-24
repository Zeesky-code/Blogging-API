const express = require('express');
const blogRouter = express.Router()

const auth =  require('../middlewares/auth')
const blogController = require('../controllers/blog.controller')
const blogValidator = require('../validators/blog.validator')

blogRouter.get('/', blogController.getBlogs)
blogRouter.get('/userBlog', auth.protect, blogController.getUserBlog)
blogRouter.get('/:id', blogController.getOneBlog)

blogRouter.post('/', auth.protect,blogValidator,blogController.createBlog)
blogRouter.delete('/:id',auth.protect, blogController.deleteBlog)
blogRouter.put('/:id', auth.protect, blogController.updateBlog)


module.exports = blogRouter