import { Link } from "react-router-dom";
import { useBlogs} from "../../stores/blogStore"
import { useUser, useUserAction } from "../../stores/userStore"
import { useEffect } from "react";

const BlogList = () => {
  const user = useUser()
  const blogs = useBlogs()
  const { retrieve } = useUserAction();

  useEffect(() => {
      retrieve()
    }, [retrieve])

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
                <Link to={`/${blog.id}`}>
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
