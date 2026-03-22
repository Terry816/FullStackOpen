const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')

const api = supertest(app)

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
  console.log(response.body)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('id is correctly named id', async () => {
  const response = await api.get('/api/blogs')
  const isCorrect = response.body.every(post => Object.hasOwn(post, "id") && !Object.hasOwn(post, "_id"))
  assert.equal(isCorrect, true)
})

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


after(async () => {
  await mongoose.connection.close()
})