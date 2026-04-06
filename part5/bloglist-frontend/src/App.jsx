import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    const res = await blogService.create(blogObject)
    setBlogs(blogs.concat(res))
    setErrorMessage(`A New Blog: ${res.title} by ${res.author} has been added`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
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
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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

  const loginForm = () => (
    <>
      <h1>Log in to the App</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  return (
    <div>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <div>
            <h2>blogs</h2>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <Togglable buttonLabel='create new blog' undoButtonLabel='cancel' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <>
              <Blog key={blog.id} blog={blog} />
            </>
          )}
        </div>
      )}

    </div>
  )
}

export default App