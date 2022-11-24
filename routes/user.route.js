const express = require('express');
const userRouter = express.Router()

const passport = require('passport')

const userController = require('../controllers/user.controller')
const userValidator =  require('../validators/user.validator')

userRouter.post('/signup',userValidator,passport.authenticate('signup', { session: false }), userController.userSignup);
userRouter.post('/login', userController.userLogin);


module.exports = userRouter