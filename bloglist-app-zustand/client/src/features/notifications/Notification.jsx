import { Alert } from "@mui/material";

const Notification = ({msg, type}) => {
  if (msg === null) {
    return null;
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      class={type}
    >
      {msg}
    </Alert>
  );
};

export default Notification;
