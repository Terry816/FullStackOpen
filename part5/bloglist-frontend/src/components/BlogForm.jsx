import { useState } from 'react'

const handleChange = (event, setField) => {
  setField(event.target.value)
}

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    createBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <>
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
    </>
  )
}

export default BlogForm