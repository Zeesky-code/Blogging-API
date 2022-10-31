const express = require('express');
const blogRouter = express.Router()


const blogController = require('../controllers/blog.controller')

blogRouter.post('/create', blogController.createBlog)


module.exports = blogRouter