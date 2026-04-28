import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import Blog from "./features/blogs/Blog";
import BlogForm from "./features/blogs/BlogForm";
import BlogList from "./features/blogs/BlogList";
import Notification from "./features/notifications/Notification";
import LoginForm from "./features/users/LoginForm";
import ErrorFallback from "./features/misc/ErrorBoundary";

import loginService from "./services/login";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const sortedBlogs = useMemo(
    () => [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)),
    [blogs],
  );
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      window.localStorage.removeItem("loggedNoteappUser");
      blogService.setToken(null);
      setUser(null);
      navigate("/login");
    } catch {
      setNotification({ text: "Cannot logout an invalid user", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const addBlog = async (blogObject) => {
    // blogFormRef.current.toggleVisibility()
    const res = await blogService.create(blogObject);
    setBlogs(blogs.concat(res));
    setNotification({
      text: `A New Blog: ${res.title} by ${res.author} has been added`,
      type: "success",
    });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const updateLike = async (blogObject) => {
    const res = await blogService.update(blogObject.id, blogObject);
    setBlogs(sortedBlogs.map((b) => (b.id === res.id ? res : b)));
  };

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      setNotification({
        text: "Don't have permission to delete another person's post",
        type: "error",
      });
      console.log(error);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
      console.log("this printed instead");
      setNotification({ text: "wrong username or password", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const match = useMatch("/notes/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const blogUserId =
    blog?.user && typeof blog.user === "object" ? blog?.user.id : blog?.user;
  const isOwner = user && blogUserId && String(blogUserId) === String(user.id);
  const hoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            blogs
          </Button>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={hoverStyle}
            >
              create blogs
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
              logout
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route
            path="/"
            element={<BlogList blogs={sortedBlogs} user={user} />}
          />
          <Route
            path="/notes/:id"
            element={
              <Blog
                blog={blog}
                user={user}
                updateLike={updateLike}
                removePost={isOwner ? removeBlog : undefined}
              />
            }
          />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route
            path="/login"
            element={
              <LoginForm
                handleSubmit={handleLogin}
                handleUsernameChange={(e) => setUsername(e.target.value)}
                handlePasswordChange={(e) => setPassword(e.target.value)}
                username={username}
                password={password}
              />
            }
          />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
