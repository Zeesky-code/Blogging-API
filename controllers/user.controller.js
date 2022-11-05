const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function userSignup(req,res,next){
    try{
        res.status(201).json({
            status: "true",
            message: 'Signup successful'
        })
    }catch(error){
        return res.status(400).josn({
            status: "false",
            message: "Signup failed"
        })
    }

} 


async function userLogin(req,res, next){
    passport.authenticate('login',async(err,user,message) =>{
        try{
            if (err){
                return next(err);
            }
            if (!user){
                return res.status(401).send(message)
            }
            req.login(user, {session:false}, async (error) =>{
                    if (error) return next(error)

                    const body = {_id: user._id, email: user.email};

                    const token = jwt.sign({ user: body },  process.env.JWT_SECRET, {expiresIn: '1hr'});

                    return res.status(200).json({
                        "message": message.message,
                        "token": token
                    });

                }
            )
        }catch(error){
            return res.status(401).send({
                status: "false",
                message: "Login failed"
            })
        }
    })(req, res, next);
    
}

module.exports = {
    userSignup,
    userLogin
}