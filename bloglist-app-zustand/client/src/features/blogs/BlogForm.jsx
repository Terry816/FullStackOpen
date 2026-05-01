import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Typography } from "@mui/material";
import { useBlogActions } from "../../stores/blogStore"; 
import useField from "../../hooks/useField"

const BlogForm = () => {
  const { reset: titleReset, ...title } = useField({name: "title", label: "Title"});
  const { reset: authorReset, ...author} = useField({type: "text", name: "author", label: "Author"});
  const { reset: urlReset, ...url} = useField({type: "url", name: "url", label: "Url"});

  const navigate = useNavigate();

  const { createNew } = useBlogActions()

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: title.value,
      author: author.value,
      url: url.value,
    };
    createNew(blogObject);
    titleReset()
    authorReset()
    urlReset()
    navigate("/");
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 360, mt: 2 }}>
      <Typography variant="h5" component="h2">
        Create New
      </Typography>
      <form onSubmit={addBlog}>
        <Stack spacing={2}>
          <TextField {...title}
          />
          <TextField {...author}
          />
          <TextField {...url}
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
