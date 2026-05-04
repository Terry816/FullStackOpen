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

import {
  useNotification,
  useNotificationActions,
} from "./store/notificationstore";
import useBlogs from "./hooks/useBlogs";

const App = () => {
  const { blogs, isPending, isError } = useBlogs();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const notification = useNotification();
  const { setMessage } = useNotificationActions();

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      window.localStorage.removeItem("loggedNoteappUser");
      blogService.setToken(null);
      setUser(null);
      navigate("/login");
    } catch {
      setMessage({ message: "Cannot logout an invalid user", type: "error" });
      setTimeout(() => {
        setMessage(null);
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
      setMessage({ message: "wrong username or password", type: "error" });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  const hoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  if (isPending) return <div>loading data...</div>;

  if (isError)
    return <div>Blogs service not available due to problems in server</div>;

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
          <Route path="/" element={<BlogList user={user} />} />
          <Route path="/notes/:id" element={<Blog user={user} />} />
          <Route path="/create" element={<BlogForm />} />
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
