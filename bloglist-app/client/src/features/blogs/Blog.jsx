import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";

const Blog = ({ blog, user, updateLike, removePost }) => {
  const id = useParams().id;
  const navigate = useNavigate();

  const addLike = (event) => {
    event.preventDefault();
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      id: blog.id,
      likes: blog.likes + 1,
      user: blog.user,
    };
    updateLike(blogObject);
  };

  const removeBlog = (event) => {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete: ${blog.title} by ${blog.author}?`,
      )
    ) {
      removePost(id);
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
          {(user || removePost) && (
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
              {removePost && (
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
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Blog;
