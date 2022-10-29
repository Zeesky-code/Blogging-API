const request = require("supertest");
const app = require("../../app");
const {connectToMongoDB} = require('../../config/db')

describe("Test the root path", () => {
    test("It should response the GET method", async done => {
        await request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBe("Welcome to Blogging API");
                done();
            });
    });
});