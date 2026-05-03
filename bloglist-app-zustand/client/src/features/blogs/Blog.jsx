import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { useBlogs, useBlogActions } from "../../stores/blogStore";
import { useUser } from "../../stores/userStore";
import { useState } from "react";

const Blog = () => {
  const user = useUser();
  const blogs = useBlogs();

  const [comment, setComment] = useState("");

  const id = useParams().id;
  const blog = id ? blogs.find((blog) => blog.id === id) : null;
  const navigate = useNavigate();

  const { upvote, remove, addComment } = useBlogActions();
  const addLike = async (event) => {
    event.preventDefault();
    await upvote(blog.id);
  };

  const removeBlog = async (event) => {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete: ${blog.title} by ${blog.author}?`,
      )
    ) {
      await remove(id);
      navigate("/");
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      return;
    }

    await addComment(id, trimmedComment);
    setComment("");
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

  const isOwner = String(blog.user?.id) === String(user?.id);

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
          alignItems="center"
          flexWrap="wrap"
          spacing={2}
          sx={{ mt: 2 }}
          useFlexGap
        >
          <Typography variant="body1" component="span">
            Likes: <strong>{blog.likes}</strong>
          </Typography>
          {
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
              {user && isOwner && (
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
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Comments
        </Typography>
        <Stack
          component="form"
          direction="row"
          spacing={2}
          sx={{ mt: 2 }}
          useFlexGap
          onSubmit={handleComment}
        >
          <TextField
            label="comment"
            name="comment"
            autoComplete="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            size="small"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!comment.trim()}
          >
            ADD COMMENT
          </Button>
        </Stack>
        {blog.comments?.length > 0 ? (
          <Box
            component="ul"
            sx={{
              mt: 2,
              mb: 0,
              pl: 3,
              color: "text.primary",
            }}
          >
            {blog.comments.map((blogComment, index) => (
              <Typography
                key={`${blogComment}-${index}`}
                component="li"
                variant="body1"
                sx={{ mb: 0.75 }}
              >
                {blogComment}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No comments yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Blog;
