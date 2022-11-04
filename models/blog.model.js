const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        require: true
    },
    tags:{
        type: [String],
    },
    timestamp:{
        type: Date,
        default: Date.now()
    },
    state:{
        type: String, 
        enum: ['draft', 'published'],
        default: 'draft'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    reading_time:{
        type: Number,

    },
    read_count:{
        type: Number,
        default: 0
    }
},
{collection:'Blog'}
)

const BlogModel = mongoose.model('Blog', blogSchema);

module.exports = BlogModel;