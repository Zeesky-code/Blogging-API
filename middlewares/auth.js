const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user.model');

const jwt = require('jsonwebtoken');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() 
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
    'signup',
    
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
            
        },
            
        async (req,email, password,done) => {
            try {
                const first_name = req.body.first_name
                const last_name = req.body.last_name
                const user = await UserModel.create({ email, password, first_name, last_name });

                return done(null, user);
            } catch (error) {
                done(error)
            }
        }
    )
);

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);
                if (!validate) {
                    return done(null, false, { message: 'Username or password is incorrect' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);


const protect = async (req, res, next) => {
    const authorization = req.get('authorization')
    let token 
    if (authorization && authorization.toLowerCase().startsWith('bearer')){
        token = authorization.substring(7)
    }
    
    if (!token){
        return res.status(401).json({error: 'Invalid or Missing Token'})
    }
    let decodedToken =  null
    try{
        // fix: expired token error showing for all types of errors
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findById(decodedToken.user._id)
        req.user = user
        next()
    }catch(e){
        if (e instanceof TokenExpiredError){
            return res.status(401).json({
                status: "false",
                error: "Token expired. Please try to Log In again"
            })
        }else if (e instanceof JsonWebTokenError){
            return res.status(401).json({
                status: "false",
                error: "Invalid Token"
            })
        
        }else{
            console.log(e)
            return res.status(401).json({
                status: "false",
                error: "An error occured, please try again"
            })
        }
    }
}

module.exports={protect}