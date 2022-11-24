const joi = require('joi');

const validateBlogMiddleWare = async (req, res, next) => {
    const blogPayload = req.body;
    try {
        await blogValidator.validateAsync(blogPayload);
        next();
    } catch (error) {
        console.log(error);
        return res.status(406).send(error.details[0].message);
    }

}


const blogValidator = joi.object({
    title: joi.string()
        .min(5)
        .max(255)
        .required(),
    description: joi.string()
        .min(5)
        .max(255)
        .required(),
    body: joi.string()
        .min(5)
        .max(500)
        .required(),
    tags: joi.string()
        .optional(),
    timestamp: joi.date()
        .default(Date.now()),
    state: joi.string()
        .default('draft')
        .optional(),
    author: joi.number()
        .optional(),
    reading_time: joi.number()
        .optional(),
    read_count: joi.number()
        .optional()
})

module.exports = validateBlogMiddleWare;