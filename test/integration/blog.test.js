const mongoose = require('mongoose')
const app = require('../../app')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../../models/user.model')
const User = require('../../models/user.model')


jest.setTimeout(30000);



const login = async (email) => {
    const response = await api.post('/user/login').send({
        email,
        password: 'testpassword',
    })
    return response.body
}

describe('Blog Route', () => {
    let blog_id
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
        blog_id = response.body.savedBlog._id
        expect(response.body.message).toBe('Blog saved successfully')
    })
    
    test('GET /blog works', async()=>{
        const response = await api
        .get('/blog')
        .expect(200)

        expect(response.body).not.toContain('draft')
    })
    test('GET /blog/userBlog works', async()=>{
        let user = 'joker@gmail.com'
        let token = await login(user)

        const response = await api
            .get('/blog/userBlog')
            .set('Authorization', `Bearer ${token.token}`)
            .expect(200)
            expect(response.body["blogs"])
        
    })

    test('PUT /blog/:id works', async()=>{
        let user = 'joker@gmail.com'
        let token = await login(user)
        const newBlog = {
            title: "Test Blog 2",
            description: "This is a simple blog to test if this endpoint works",
            body: `Hi, I'm zainab and I would really liek to becoem a backend end dev.
                    I'm an altschool studnet and we've been learning cool stuff. 
                    Can you believe I just learnt how to write JS and I'm now writing
                    tests and building an API. I feel so happy.`,
            tags: "work"
        }
        const response = await api
            .put(`/blog/${blog_id}`)
            .set('Authorization', `Bearer ${token.token}`)
            .send(newBlog)
            .expect(201)
            expect(response.body.message).toBe('Blog updated successfully')
    })
    test('DELETE /blog/:id works', async() =>{
        let user = 'joker@gmail.com'
        let token = await login(user)
        const response = await api
            .delete(`/blog/${blog_id}`)
            .set('Authorization', `Bearer ${token.token}`)
            .expect(200)

            expect(response.body.message).toBe("Blog deleted successfully")
    })
});


