const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Comment = require('../models/comment.model')
const Blog = require('../models/blog.model')

async function createComment(req,res,next){
    try {
        const newComment = new Comment( {
            postId: req.params.id,
            author: req.user._id,
            body: req.body.body
        });
        
        const savedComment = await newComment.save();

        //adding comment to blog object
        const blogPost = await Blog.findById(newComment.postId)
        blogPost.comments = blogPost.comments.concat(savedComment._id)
        blogPost.save()

        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = {
    createComment
}