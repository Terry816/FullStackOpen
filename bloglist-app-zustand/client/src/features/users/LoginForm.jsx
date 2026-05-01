import { TextField, Button, Stack, Typography } from "@mui/material";
import { useUser, useUserAction } from "../../stores/userStore";
import { useState, useEffect } from "react";
import {useNotification, useNotificationActions} from "../../stores/notificationStore"
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

  const { setMessage } = useNotificationActions();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useUserAction()

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login(username, password)
      setUsername("");
      setPassword("");
      navigate("/");
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

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
        onChange={(e) => setUsername(e.target.value)}
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
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        size="small"
        variant="outlined"
      />
      <Button
        type="submit"
        onClick={handleLogin}
        variant="contained"
        fullWidth
      >
        Log in
      </Button>
    </Stack>
  );
};

export default LoginForm;


// the login is not error catching properly
//logout needs ot be functioning properly currently in navbar

//finisih zustand and all the zustand stuff then we can try tanstack for practice.