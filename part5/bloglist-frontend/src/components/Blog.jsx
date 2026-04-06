import { useRef } from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, updateLike, removePost }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const blogFormRef = useRef()

  const addLike = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      id: blog.id,
      likes: blog.likes + 1
    }
    updateLike(blogObject)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Are you sure you want to delete: ${blog.title} by ${blog.author}?`)) {
      removePost(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
      </div>
      <Togglable buttonLabel='view' undoButtonLabel='hide' ref={blogFormRef}>
        <div>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}</p> <button onClick={addLike}>upvote</button>
          <p>{blog.author}</p>
          <p><button onClick={removeBlog}>remove</button></p>
        </div>
      </Togglable>
    </div>
  )
}

export default Blog