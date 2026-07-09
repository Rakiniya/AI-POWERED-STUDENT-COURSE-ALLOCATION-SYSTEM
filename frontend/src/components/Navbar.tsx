import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

 const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardIcon />
  },
  {
    label: "Students",
    path: "/students",
    icon: <PeopleIcon />
  },
  {
    label: "Courses",
    path: "/courses",
    icon: <SchoolIcon />
  },
  {
    label: "Allocation",
    path: "/allocation",
    icon: <AssignmentTurnedInIcon />
  },
  {
    label: "AI Assistant",
    path: "/ai",
    icon: <SmartToyIcon />
  },
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
    mx:1,
    display:"flex",
    alignItems:"center",
    gap:0.5,
    borderBottom:
      location.pathname === item.path
      ? "3px solid white"
      : "none",
    borderRadius:0,
  }}
>

  {item.icon}

  {item.label}

</Button>

        ))}

        

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;