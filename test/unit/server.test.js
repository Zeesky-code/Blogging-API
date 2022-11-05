const request = require("supertest");
const app = require("../../app");


describe("Test the root path", () => {
    test("It should response the GET method", async () => {
        await request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toBe("Welcome to Blogging API");
            });
    });
});