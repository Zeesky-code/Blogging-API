const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name:{
        type: String,
        required:true
    },
    last_name:{
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    blogs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
},
{collection:'User'}
);


UserSchema.pre(
    'save',
    async function (next) {
        const user = this;
        
        //to stop unnecessary password rehashing
        if (!user.isModified('password')){return next()}

        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);

// You will also need to make sure that the user trying to log in has the correct credentials. Add the following new method:
UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;