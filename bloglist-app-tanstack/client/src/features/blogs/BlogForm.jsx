import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Typography } from "@mui/material";
import useBlogs from "../../hooks/useBlogs";
import { useNotificationActions } from "../../store/notificationstore";

const handleChange = (event, setField) => {
  setField(event.target.value);
};

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const navigate = useNavigate();
  const { setMessage } = useNotificationActions();
  const { createBlog } = useBlogs();

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
    createBlog(blogObject);
    setMessage({
      message: `A New Blog: ${blogObject.title} by ${blogObject.author} has been added`,
      type: "success",
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
    navigate("/");
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 360, mt: 2 }}>
      <Typography variant="h5" component="h2">
        Create New
      </Typography>
      <form onSubmit={addBlog}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            value={newTitle}
            onChange={(e) => handleChange(e, setNewTitle)}
            fullWidth
            size="small"
            variant="outlined"
            autoComplete="off"
          />
          <TextField
            label="Author"
            name="author"
            value={newAuthor}
            onChange={(e) => handleChange(e, setNewAuthor)}
            fullWidth
            size="small"
            variant="outlined"
            autoComplete="off"
          />
          <TextField
            label="URL"
            name="url"
            type="url"
            value={newUrl}
            onChange={(e) => handleChange(e, setNewUrl)}
            fullWidth
            size="small"
            variant="outlined"
            autoComplete="off"
          />
          <Button type="submit" variant="contained" fullWidth>
            create
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default BlogForm;
