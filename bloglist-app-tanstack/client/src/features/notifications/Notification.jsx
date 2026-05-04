import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  if (!notification?.message) {
    return null;
  }

  const { message, type } = notification;

  return (
    <Alert
      severity={type ?? "info"}
      style={{ marginTop: 10, marginBottom: 10 }}
    >
      {message}
    </Alert>
  );
};

export default Notification;
