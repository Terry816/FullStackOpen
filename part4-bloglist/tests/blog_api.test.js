const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')

const api = supertest(app)

describe("When there is initially some blogs posted", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('id is correctly named id', async () => {
    const response = await api.get('/api/blogs')
    const isCorrect = response.body.every(post => Object.hasOwn(post, "id") && !Object.hasOwn(post, "_id"))
    assert.equal(isCorrect, true)
  })

  describe("Adding Blogs attributes validation", () => {

    test('default likes set to 0', async () => {
      const newBlog = {
        title: "Harry Potter 's Stone",
        author: "J.K. Rowling",
        url: "http://localhost:3003/api/blogs"
      }
      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('Blog without Title should not be added', async () => {
      const newBlogNoTitle = {
        author: "J.K. Rowling",
        url: "http://localhost:3003/api/blogs"
      }
      const newBlogNoURL = {
        title: "To Kill a mockingbird",
        author: "Terry Kim"
      }

      await api
        .post('/api/blogs')
        .send(newBlogNoTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .send(newBlogNoURL)
        .expect(400)

      const blogsAtEnd = await helper.BlogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe("Modifying/Delete a specific Blog", () => {
    test("Deleting a Blog Post", async () => {
      const blogs = await helper.BlogsInDb()
      const blogtoDelete = blogs[0]

      await api
        .delete(`/api/blogs/${blogtoDelete.id}`)
        .expect(204)
      const blogsAtEnd = await helper.BlogsInDb()

      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogtoDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test("Updating an Individual Blog Post", async () => {
      const blogs = await helper.BlogsInDb()
      const blogtoUpdate = blogs[0]
      blogtoUpdate.likes = 1000

      await api
        .put(`/api/blogs/${blogtoUpdate.id}`)
        .send(blogtoUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.BlogsInDb()
      const updatedBlog = blogsAtEnd.find(n => n.id === blogtoUpdate.id)
      assert.strictEqual(updatedBlog.likes, 1000)

    })

  })

})

after(async () => {
  await mongoose.connection.close()
})