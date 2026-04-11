import { Link } from 'react-router-dom'

const BlogList = ({ blogs, user }) => {

  return (
    <>
      {(
        <div>
          <div>
            <h2>blogs</h2>
            <p>{user && user.name} {user ? "logged in" : ""}</p>
          </div>
          <ul>
            {blogs.map(blog => (
              <li key={blog.id}>
                <Link to={`/notes/${blog.id}`}>{blog.title} by {blog.author}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

    </>
  )


}

export default BlogList