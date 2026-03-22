const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const res = await blog.save()
  response.status(201).json(res)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  if (!Object.hasOwn(body, 'likes')) {
    return response.status(400).json({ error: 'likes is required' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (Object.hasOwn(body, 'title')) blog.title = body.title
  if (Object.hasOwn(body, 'author')) blog.author = body.author
  if (Object.hasOwn(body, 'url')) blog.url = body.url
  blog.likes = body.likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})


module.exports = blogRouter