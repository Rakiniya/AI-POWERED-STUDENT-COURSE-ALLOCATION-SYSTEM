import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";

import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Students", path: "/students" },
  { label: "Courses", path: "/courses" },
  { label: "Preferences", path: "/preferences" },
  { label: "Allocation", path: "/allocation" },
  { label: "AI Assistant", path: "/ai" },
];
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#1976d2",
      }}
    >
      <Toolbar>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <SchoolIcon sx={{ mr: 1 }} />

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold" }}
          >
            Student Course Allocation System
          </Typography>
        </Box>

        {menuItems.map((item) => (

          <Button
            key={item.path}
            component={Link}
            to={item.path}
            color="inherit"
            sx={{
              mx: 1,
              borderBottom:
                location.pathname === item.path
                  ? "3px solid white"
                  : "none",
              borderRadius: 0,
              fontWeight:
                location.pathname === item.path
                  ? "bold"
                  : "normal",
            }}
          >
            {item.label}
          </Button>

        ))}

        

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;