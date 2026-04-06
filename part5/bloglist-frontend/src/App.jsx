import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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

  const addBlog = async event => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const res = await blogService.create(blogObject)
    setBlogs(blogs.concat(res))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
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

  const handleChange = (event, setField) => {
    setField(event.target.value)
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


  const blogForm = () => (
    <>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input value={newTitle} onChange={(e) => handleChange(e, setNewTitle)} />
          </label>
        </div>
        <div>
          <label>
            author
            <input value={newAuthor} onChange={(e) => handleChange(e, setNewAuthor)} />
          </label>
        </div>
        <div>
          <label>
            url
            <input value={newUrl} onChange={(e) => handleChange(e, setNewUrl)} />
          </label>
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )


  return (
    <div>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          {blogForm()}
        </div>
      )}

    </div>
  )
}

export default App