const express = require('express');
const blogRouter = express.Router()

const auth =  require('../middlewares/auth')
const utils =  require('../utils/utils')
const blogController = require('../controllers/blog.controller')

blogRouter.get('/', utils.filterBy, blogController.getBlogs)
blogRouter.get('/userBlog', auth.protect, blogController.getUserBlog)
blogRouter.get('/:id', blogController.getOneBlog)

blogRouter.post('/', auth.protect,blogController.createBlog)
blogRouter.delete('/:id',auth.protect, blogController.deleteBlog)
blogRouter.put('/:id', auth.protect, blogController.updateBlog)


module.exports = blogRouter