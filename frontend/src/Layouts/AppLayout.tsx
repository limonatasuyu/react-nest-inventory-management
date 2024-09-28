import { useState, useEffect } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useNavigate } from "react-router";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function MiniDrawer() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
    axios.post('https://react-nest-inventory-management-production.up.railway.app/auth/logout', {
      withCredentials: true
    })
  }

  useEffect(() => {
    
  const api = axios.create({
      baseURL: 'https://react-nest-inventory-management-production.up.railway.app',
  });

  api.interceptors.response.use(
    (response) => response, // Return the response if it's successful
    (error) => {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
      return Promise.reject(error);
    }
  );
  }, [])

  const items = [
    {
      name: "Dashboard",
      path: "/",
      icon: <DashboardIcon />,
    },
    {
      name: "Items",
      path: "/items",
      icon: <InventoryIcon />,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: <CategoryIcon />,
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      icon: <LocalShippingIcon />,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: <ShoppingCartIcon />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={open ? {} : { alignSelf: "center" }}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ "&:focus": { outline: "none" } }}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {items.map((item, index) => (
            <ListItem disablePadding key={index} sx={{ display: "block" }}>
              <ListItemButton href={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Outlet />
    </Box>
  );
}
