const joi = require('joi');

const validateUserMiddleWare = async (req, res, next) => {
    const UserPayload = req.body;
    try {
        await userValidator.validateAsync(UserPayload);
        next();
    } catch (error) {
        console.log(error);
        return res.status(406).send(error.details[0].message);
    }

}


const userValidator = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    first_name: joi.string()
        .min(5)
        .max(255)
        .required(),
    last_name: joi.string()
        .min(5)
        .max(255)
        .required(),
    password: joi.string()
        .min(5)
        .max(13)
        .required()
})

module.exports = validateUserMiddleWare;