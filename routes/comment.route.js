const express = require('express');
const commentRouter = express.Router()

const auth =  require('../middlewares/auth')
const commentController = require('../controllers/comment.controller')

commentRouter.post('/:id', auth.protect, commentController.createComment)
commentRouter.get('/:id', commentController.getComments)
commentRouter.delete('/:id', auth.protect,commentController.deleteComment )



module.exports = commentRouter