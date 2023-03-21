require('dotenv').config();
const logger = require('../utils/logger');
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


        blogPost.comments = blogPost.comments.concat(savedComment.body)
        blogPost.save()

        res.status(201).json(savedComment);
    } catch (error) {
        logger.error(`Error: ${error} when trying to create a commnont on a user's blog with id ${req.params.id}`)
        res.status(500).json({ message: error.message });
    }
}

async function getComments(req,res,next){
    try{
        const blogPost = await Blog.findById(req.params.id)

        res.status(200).json(blogPost.comments)
    }catch(error){
        logger.error(`Error: ${error} when trying to get comments on a user's blog with id ${req.params.id}`)
        res.status(500).json({ message: error.message });
    }
}

async function deleteComment(req,res,next){
    const user = req.user
    const id = req.params.id
    try {
        const comment = await Comment.findById(id)
        if (user.id == comment.author) {
            await Comment.deleteOne({ _id: id })
            return res.status(200).json({
                state: "true",
                message: "Comment deleted successfully"
            })
        } else {
            return res.status(403).json({
                state: "false",
                message: "You're not authorized to perform this action"
            })
        }

    } catch (err) {
        logger.error(`Error: ${error} when trying to delete a comment with id ${req.params.id}`)
        return res.status(404).json({
            state: "false",
            message: "Comment not found"
        })
    }

}

module.exports = {
    createComment,
    getComments,
    deleteComment
}