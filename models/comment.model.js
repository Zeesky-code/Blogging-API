const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    body:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{collection:'Comment'}
)

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;