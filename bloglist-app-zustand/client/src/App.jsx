import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import Blog from "./features/blogs/Blog";
import BlogForm from "./features/blogs/BlogForm";
import BlogList from "./features/blogs/BlogList";
import Notification from "./features/notifications/Notification";
import LoginForm from "./features/users/LoginForm";
import ErrorFallback from "./features/misc/ErrorBoundary";
import Navbar from "./features/misc/Navbar";

import {useNotification, useNotificationActions} from "./stores/notificationStore"
import { useBlogActions } from "./stores/blogStore"


const App = () => {

  const message = useNotification();
  const { setMessage } = useNotificationActions();
  const { initialize } = useBlogActions()

  const navigate = useNavigate();

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <Container>
    <Navbar ></Navbar>

      <Notification notification={message} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route
            path="/"
            element={<BlogList />}
          />
          <Route
            path="/:id"
            element={
              <Blog />
            }
          />
          <Route path="/create" element={<BlogForm />} />
          <Route
            path="/login"
            element={
              <LoginForm />
            }
          />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
