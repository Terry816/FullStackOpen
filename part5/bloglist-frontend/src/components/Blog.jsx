import { useRef } from "react"
import Togglable from "./Togglable"

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogFormRef = useRef()

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
      </div>
      <Togglable buttonLabel='view' undoButtonLabel='hide' ref={blogFormRef}>
        <div>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}</p>
          <p>{blog.author}</p>
        </div>
      </Togglable>
    </div>
  )
}

export default Blog