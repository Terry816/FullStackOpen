import { useParams, useNavigate } from 'react-router-dom'

const Blog = ({ blog, user, updateLike, removePost }) => {
  const id = useParams().id
  const navigate = useNavigate()

  const addLike = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      id: blog.id,
      likes: blog.likes + 1,
      user: blog.user
    }
    updateLike(blogObject)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Are you sure you want to delete: ${blog.title} by ${blog.author}?`)) {
      removePost(id)
      navigate('/')
    }
  }

  return (
    <div>
      <h1>
        {blog.author}: {blog.title}
      </h1>
      <div>
        <a data-testid='url' href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
        <p>likes: {blog.likes}</p> {user && <button onClick={addLike}>upvote</button>}
        <p>Added by: {blog.user?.username ?? ''}</p>
        <p>{removePost && <button onClick={removeBlog}>remove</button>}</p>
      </div>
    </div>
  )
}

export default Blog