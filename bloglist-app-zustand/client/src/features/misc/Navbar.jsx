import { AppBar, Toolbar, Button } from "@mui/material";
import { Link, useNavigate  } from "react-router-dom";
import { useUser, useUserAction } from "../../stores/userStore"
import { useNotificationActions } from "../../stores/notificationStore"

const Navbar = () => {
  const user = useUser()
  const hoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  const navigate = useNavigate();

  const { logout } = useUserAction()

  const handleLogout = async (event) => {
      event.preventDefault();
      logout()
      navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users" sx={hoverStyle}>
          Users
        </Button>
        {user && (
          <Button
            color="inherit"
            component={Link}
            to="/create"
            sx={hoverStyle}
          >
            create blogs
          </Button>
        )}
        {user ? (
          <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
            logout
          </Button>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={hoverStyle}
          >
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar