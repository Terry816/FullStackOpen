import { useState, useEffect, useMemo } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'

import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const navigate = useNavigate()

  const sortedBlogs = useMemo(
    () => [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)),
    [blogs]
  )
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBlogs()
  }, [])

  const handleLogout = async event => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedNoteappUser')
      blogService.setToken(null)
      setUser(null)
    } catch {
      setErrorMessage('Cannot logout an invalid user')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async blogObject => {
    // blogFormRef.current.toggleVisibility()
    const res = await blogService.create(blogObject)
    setBlogs(blogs.concat(res))
    setErrorMessage(`A New Blog: ${res.title} by ${res.author} has been added`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const updateLike = async blogObject => {
    const res = await blogService.update(blogObject.id, blogObject)
    setBlogs(sortedBlogs.map(b => b.id === res.id ? res : b))
  }

  const removeBlog = async id => {
    try {
      await blogService.remove(id)
      setBlogs(prev => prev.filter(b => b.id !== id))
    } catch (error) {
      setErrorMessage('Don\'t have permission to delete another person\'s post')
      console.log(error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      console.log('this printed instead')
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/notes/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const blogUserId =
    blog?.user && typeof blog.user === 'object'
      ? blog?.user.id
      : blog?.user
  const isOwner =
    user && blogUserId && String(blogUserId) === String(user.id)

  return (

    <div>
      <Notification message={errorMessage} />

      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && <Link style={padding} to="/create">create blog</Link>}
        {user ? (
          <button type="button" style={padding} onClick={handleLogout}>
            logout
          </button>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<BlogList blogs={sortedBlogs} user={user} />} />
        <Route path="/notes/:id" element={
          <Blog
            blog={blog}
            user={user}
            updateLike={updateLike}
            removePost={isOwner ? removeBlog : undefined}
          />
        } />
        <Route path="/create" element={
          <BlogForm createBlog={addBlog} />
        } />
        <Route path="/login" element={
          <LoginForm handleSubmit={handleLogin} handleUsernameChange={(e) => setUsername(e.target.value)} handlePasswordChange={(e) => setPassword(e.target.value)} username={username} password={password} />
        } />
      </Routes>
    </div>
  )
}

export default App