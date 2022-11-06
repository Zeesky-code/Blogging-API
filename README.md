# Blogging API
An API for a blog built with Node.js, ExpressJS and MongoDB

## Base URL
- https://wild-pink-sturgeon-cape.cyclic.app/


## Requirements
- Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
- A user should be able to sign up and sign in into the blog app
- Use JWT as authentication strategy and expire the token after 1 hour
- A blog can be in two states; draft and published
- Logged in and not logged in users should be able to get a list of published blogs created
- Logged in and not logged in users should be able to to get a published blog
- Logged in users should be able to create a blog.
- When a blog is created, it is in draft state
- The owner of the blog should be able to update the state of the blog to published
- The owner of a blog should be able to edit the blog in draft or published state
- The owner of the blog should be able to delete the blog in draft or published state
- The owner of the blog should be able to get a list of their blogs. 
- The endpoint should be paginated
- It should be filterable by state
- Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
- The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, default it to 20 blogs per page. 

## Data Models
---

### User Model
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  firstname | string  |  required |
|  lastname  |  string |  required  |
|  email     | string  |  required |
|  password |   string |  required  |


### Blog Model
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  created_at |  date |  required |
|  title |   string |  required  |
|  description |  string |  optional |
|  body |   string |  required  |
|  state | string  |  required, default:'draft', enum: ['draft', 'published']|
|  tags     | array  |  optional |
|  read_Count     | Number  |  |
|  reading_time     | Number  |   |
|  author     | ref- User  |   |

## API Endpoints
---

### User SignUp

- Route: /user/signup
- Method: POST
- Example Request: 
```
{
  "email": "user@example.com",
  "firstname": "Test",
  "lastname": "User",
  "password": "Password123",
  
}
```

- Responses

Success
```
{
    state: "true",
    message: 'Signup successful',
   
}
```
---
### User Login

- Route: /user/login
- Method: POST
- Example: 
```
{
    "email": 'user@example.com",
    "password": "Password123",
  
}
```

- Responses

Success
```
{
    message: "Logged In Successfully",
    token: 'te12st27893to02987ken093876tuse98765r'
}
```

---
### Create a Blog

- Route: /blog
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{

  title: "JS- The Good, The Bad and The Ugly",
  description: "A short blog about the postives and negatives of JavaScript",
  tags: ["tech"],
  body: "This is a test blog, let's see what it prints."
}
```

- Responses

Success
```
{
    created_at: Sun Nov 06 2022 15:35:00 GMT+0300,
    status: true,
    newBlog: { 
       title: "JS- The Good, The Bad and The Ugly", 
       description: "A short blog about the postives and negatives of JavaScript", 
       tags: ["tech"],
       body: "This is a test blog, let's see what it prints",
       state: "draft",
       read_Count:0,
       reading_time:1, 
       author: 9874567i8o998itr567890
}
```
---
### Get All Published Blogs

- Route: /blog
- Method: GET
- Header
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 0)
    - skip (default: 20)
    - order_by (options: timestamp| read_count)

- Responses

Success
```
{
    status: true,
    article: [{ 
       title: "JS- The Good, The Bad and The Ugly", 
       description: "A short blog about the postives and negatives of JavaScript", 
       tags: ["tech"],
       body: "This is a test blog, let's see what it prints",
       state:"published"
       read_Count:0, reading_time:1, 
       author: 9874567i8o998itr567890
  }]
}
```
---

### Get All Blogs for a User
- Route: /articles/user/:userID
- Method: GET
- Header
    - Authorization: Bearer {token}
- Query params:
    - page (default: 0)
    - skip (default: 20)
    - order_by (default: created_at)
    - state (default: published)
- Responses

Success
```
{
    status: true,
    article: [{ 
       title: "JS- The Good, The Bad and The Ugly", 
       description: "A short blog about the postives and negatives of JavaScript", 
       tags: ["tech"],
       body: "This is a test blog, let's see what it prints",
       state:"published"
       read_Count:0, reading_time:1, 
       author:9874567i8o998itr567890
  }]
}
```
---

### Get a blog
- Route: /blog/:ID
- Method: GET
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    status: true,
    blog: { 
       title: "JS- The Good, The Bad and The Ugly", 
       description: "A short blog about the postives and negatives of JavaScript", 
       tags: ["tech"],
       body: "This is a test blog, let's see what it prints"},
       state:'published'
       read_Count:0, 
       reading_time:1, 
       author: 9874567i8o998itr567890
  }
}
```


### Update Blog

- Route: /blog/:ID
- Method: PUT
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    title: "Test Blog",
    description: "This is a simple blog to test if this endpoint works",
    body: `Hi, I'm zainab and I would really liek to becoem a backend end dev.
            I'm an altschool studnet and we've been learning cool stuff. 
            Can you believe I just learnt how to write JS and I'm now writing
            tests and building an API. I feel so happy.`,
    tags: "school"
}
```

- Responses

Success
```
{
    state: "true",
    message: "Blog updated successfully"
}

```
---
### Delete a blog

- Route: /blogs/:ID
- Method: GET
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    state: "true",
    message: "Blog deleted successfully"
}
```
---


...
