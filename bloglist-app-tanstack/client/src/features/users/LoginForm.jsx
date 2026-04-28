import { TextField, Button, Stack, Typography } from "@mui/material";

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <Stack spacing={2} sx={{ maxWidth: 360, mt: 2 }}>
      <Typography variant="h5" component="h2">
        Login
      </Typography>
      <TextField
        label="Username"
        name="username"
        autoComplete="username"
        value={username}
        onChange={handleUsernameChange}
        fullWidth
        size="small"
        variant="outlined"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
        fullWidth
        size="small"
        variant="outlined"
      />
      <Button
        type="submit"
        onClick={handleSubmit}
        variant="contained"
        fullWidth
      >
        Log in
      </Button>
    </Stack>
  );
};

export default LoginForm;
