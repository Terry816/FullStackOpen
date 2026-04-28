const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author ?? "",
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()
  const populated = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populated)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await populateBlogUser(Blog.findById(request.params.id))
  if (!blog) {
    return response.status(404).end()
  }
  response.json(blog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  //decodedToken.id - cooresponds to the logged-in user's ID
  //request.params.id - cooresponds to the blogs id
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (!blog.user || blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const body = request.body
  const isOwner =
    blog.user && blog.user.toString() === decodedToken.id.toString()
  if (isOwner) {
    if (Object.hasOwn(body, 'title')) blog.title = body.title
    if (Object.hasOwn(body, 'author')) blog.author = body.author
    if (Object.hasOwn(body, 'url')) blog.url = body.url
    if (Object.hasOwn(body, 'likes')) blog.likes = body.likes
  } else {
    if (!Object.hasOwn(body, 'likes')) {
      return response
        .status(403)
        .json({ error: 'only the creator can update a blog' })
    }
    blog.likes = body.likes
  }

  const updatedBlog = await blog.save()
  const populated = await updatedBlog.populate('user', { username: 1, name: 1 })
  response.json(populated)
})


module.exports = blogRouter