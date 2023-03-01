/**
 * @swagger
 * components:
 *  schemas:
 *      Blog:
 *          type: object
 *          required:
 *              - title
 *              - description
 *              - body
 *          properties:
 *              id: 
 *                  type: string
 *                  description: The auto-generated id of the blog post
 *              title:
 *                  type: string
 *                  description: The title of your blog post
 *              body:
 *                  type: string
 *                  description: The body of your blog post
 *              tags:
 *                  type: string
 *                  description: The tags of the blog post
 *              comments:
 *                  type: string
 *                  description: The comments about the blog post
 *              timestamp:
 *                  type: string
 *                  format: date
 *                  description: The date the blog post was created
 *              state:
 *                  type: string
 *                  description: Whether the blog post is publish or a draft. It defaults to draft.
 *              author:
 *                  type: string
 *                  description: The id of the blog post's author
 *              reading_time:
 *                  type: number
 *                  description: The number of time, in minutes it takes to read the blog post
 *              read_count:
 *                  type: number
 *                  description: The number of times a blog post has been read
 *          example:
 *              _id: 6364aa4790f95c704c7444d2
 *              title: Rollercoasters -  the hidden secret
 *              description: A short story about the invention of rollercoasters and their tricks
 *              body: This is a very short api. There are few endpoints and it's easy to lea…"
 *              tags: Weather
 *              timestamp: 2022-11-04T05:59:25.446+00:00
 *              state: draft
 *              author: 6364a4b6e85042c3c585724c
 *              reading_time: 1
 *              read_count: 4
 * 
 */

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