const mongoose = require('mongoose')
const app = require('../../app')
const supertest = require('supertest')
const api = supertest(app)
constBlog = require('../../models/user.model')


jest.setTimeout(100000);


const login = async (email) => {
    const response = await api.post('/user/login').send({
        email,
        password: 'testpassword',
    })
    return response.body
}

describe('Blog Route', () => {
    test('POST /blog works', async () => {
        let user = 'joker@gmail.com'
        let token = await login(user)
        const newBlog = {
            title: "Test Blog",
            description: "This is a simple blog to test if this endpoint works",
            body: `Hi, I'm zainab and I would really liek to becoem a backend end dev.
                    I'm an altschool studnet and we've been learning cool stuff. 
                    Can you believe I just learnt how to write JS and I'm now writing
                    tests and building an API. I feel so happy.`,
            tags: "school"
        }
    
    const response = await api
        .post('/blog')
        .set('Authorization', `Bearer ${token.token}`)
        .send(newBlog)
        .expect(201)
        expect(response.body.message).toBe('Blog saved successfully')
    
    })
})