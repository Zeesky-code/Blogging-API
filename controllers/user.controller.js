const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function userSignup(req,res,next){
    try{
        res.json({
            message: 'Signup successful',
            user: req.user
        })
    }catch(error){
        return next(err)
    }

} 


async function userLogin(req,res, next){
    console.log(req.body)
    passport.authenticate('login',async(err,user,info) =>{
        try{
            if (err){
                return next(err);
            }
            if (!user){
                const error = new Error('Username or password is incorrect')
                return next(error)
            }
            req.login(user, {session:false}, async (error) =>{
                    if (error) return next(error)

                    const body = {_id: user._id, email: user.email};

                    const token = jwt.sign({ user: body },  process.env.JWT_SECRET, {expiresIn: '1hr'});

                    return res.status(200).json({
                        "message": user.email + " signed in successfully",
                        token 
                    });

                }
            )
        }catch(error){
            return next(error);
        }
    })(req, res, next);
    
}

module.exports = {
    userSignup,
    userLogin
}