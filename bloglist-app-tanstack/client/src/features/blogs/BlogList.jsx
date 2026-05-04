import { Link } from "react-router-dom";
import useBlogs from "../../hooks/useBlogs";

const BlogList = ({ user }) => {
  const { blogs } = useBlogs();
  return (
    <>
      {
        <div>
          <div>
            <h2>blogs</h2>
            <p>
              {user && user.name} {user ? "logged in" : ""}
            </p>
          </div>
          <ul>
            {blogs.map((blog) => (
              <li key={blog.id}>
                <Link to={`/notes/${blog.id}`}>
                  {blog.title} by {blog.author}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      }
    </>
  );
};

export default BlogList;
