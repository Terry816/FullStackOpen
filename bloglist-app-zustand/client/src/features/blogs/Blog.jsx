import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useBlogs, useBlogActions } from "../../stores/blogStore";
import { useUser } from "../../stores/userStore"

const Blog = () => {
  const user = useUser()
  const blogs = useBlogs()

  const id = useParams().id;
  const blog = id ? blogs.find((blog) => blog.id === id) : null;
  const navigate = useNavigate();

  const { upvote, remove } = useBlogActions();

  const isOwner = String(blog.user?.id) === String(user?.id);
  const addLike = (event) => {
    event.preventDefault();
    upvote(blog.id);
    
  };

  const removeBlog = (event) => {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete: ${blog.title} by ${blog.author}?`,
      )
    ) {
      remove(id);
      navigate("/");
    }
  };

  if (!blog) {
    return (
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }} variant="outlined">
          <Typography color="text.secondary">Blog not found.</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {blog.author}
        </Typography>
        <Link
          data-testid="url"
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="body1"
          sx={{ wordBreak: "break-all" }}
        >
          {blog.url}
        </Link>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Added by: {blog.user?.username ?? "—"}
        </Typography>
        <Stack
          direction="row"
          alignitems="center"
          flexwrap="wrap"
          spacing={2}
          sx={{ mt: 2 }}
          useFlexGap
        >
          <Typography variant="body1" component="span">
            Likes: <strong>{blog.likes}</strong>
          </Typography>
          {
            <Stack direction="row" spacing={1} flexwrap="wrap" useFlexGap>
              {user && (
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={addLike}
                >
                  upvote
                </Button>
              )}
              {(user && isOwner) && (
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={removeBlog}
                >
                  remove
                </Button>
              )}
            </Stack>
          }
        </Stack>
      </Paper>
    </Box>
  );
};

export default Blog;
