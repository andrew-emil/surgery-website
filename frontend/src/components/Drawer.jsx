import * as React from "react";
import { styled, useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useStateContext } from "../context/contextprovider";
import DarkModeButton from "./darkmodeButton";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Link, TextField, Avatar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { Circle } from "@mui/icons-material";
import axiosClient from "../axiosClient";
import { convertImage } from "./../utils/convertImage";
import { useNotifications } from "./../hooks/useNotifications ";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(Autocomplete)(({ theme }) => ({
  width: "100%",
  maxWidth: "500rem",
  marginLeft: theme.spacing(4),
  // marginRight: theme.spacing(4),

  "& .MuiInputBase-root": {
    width: "90%",
    backgroundColor: "transparent", // or add a background if needed
    border: "none",
    boxShadow: "none",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "& .MuiInputBase-input": {
    width: "100%",
    padding: theme.spacing(1.2, 2),
    fontSize: "1rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
      padding: theme.spacing(1),
    },
  },
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //////////////////////////////////////////////
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMyAccont = () => {
    navigate("/account");
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const { setUser, setToken } = useStateContext();
  const handlelogout = (ev) => {
    ev.preventDefault();
    setUser(null);
    setToken(null);
  };

  const [userData, setUserData] = React.useState(null);
  const { socket, user } = useStateContext();
  const { notifications, unreadCount, setNotifications, setUnreadCount } =
    useNotifications();
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem onClick={hand}>Profile</MenuItem> */}
      <MenuItem onClick={handleMyAccont}>My account</MenuItem>
      <MenuItem onClick={handlelogout}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label={`show ${unreadCount} notification`}
          color="inherit"
        >
          <Badge badgeContent={unreadCount} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          {userData?.picture ? (
            <Avatar src={convertImage(userData.picture.data)} />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem>
        <DarkModeButton></DarkModeButton>
      </MenuItem>
    </Menu>
  );

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchorEl(null);
  };

  React.useEffect(() => {
    if (!socket || !user) return;

    socket.connect();
    const userId = user.id;

    socket.on(`notification:${userId}`, (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off(`notification:${userId}`);
      socket.disconnect();
    };
  }, [setNotifications, socket, user]);

  const markAsRead = async (notificationId) => {
    try {
      await axiosClient.patch(
        "/notification",
        { userId: user.id, notificationId },
        { withCredentials: true }
      );
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/users", {
          withCredentials: true,
        });
        const { data } = response;
        setUserData(data.user);
      } catch (err) {
        console.log(err);
      }
    };

    const loadNotifications = async () => {
      try {
        const response = await axiosClient.get(`/notification/${user.id}`, {
          withCredentials: true,
        });
        const { data } = response;

        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    fetchData();
    loadNotifications();
  }, [setNotifications, setUnreadCount, user]);

  const [userSurgeries, setUserSurgeries] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/surgery/surgeries", {
          withCredentials: true,
        });
        const { data } = response;
        setUserSurgeries(data.surgeries);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  const filterOptions = (options, { inputValue }) => {
    return options.filter((option) => {
      const searchStr = inputValue.toLowerCase();
      return (
        option.name.toLowerCase().includes(searchStr) ||
        option.icdCode?.toLowerCase().includes(searchStr) ||
        option.cptCode?.toLowerCase().includes(searchStr)
        // || option.doctorName?.toLowerCase().includes(searchStr) // if you add doctorName
      );
    });
  };

  const handleButtonClick = (surgeryId) => {
    console.log(surgeryId);
    navigate("/surgeryDetails", {
      state: {
        surgeryId,
      },
    });
  };

  const handleSurgerySelect = (event, value) => {
    if (value) {
      handleButtonClick(value.id);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>

          <Link
            href="/home"
            variant="h6"
            noWrap
            sx={{ display: { xs: "none", sm: "block", fontWeight: "bold" } }}
            underline="none"
            color="inherit"
          >
            Surgical Web
          </Link>
          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              disableClearable
              freeSolo
              id="custom-search"
              options={userSurgeries}
              filterOptions={filterOptions}
              getOptionLabel={(option) => option.name}
              onChange={handleSurgerySelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search…"
                  InputLabelProps={{ shrink: false }}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                    },
                  }}
                />
              )}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              sx={{ marginX: 2 }}
              size="large"
              aria-label={`show ${unreadCount} notification`}
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={unreadCount} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleCloseNotifications}
            >
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  sx={{
                    Width: "19rem",
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  />
                  {!notification.read && (
                    <Circle sx={{ color: "primary.main", fontSize: 8 }} />
                  )}
                </MenuItem>
              ))}
              {notifications.length === 0 && (
                <MenuItem disabled>No notifications</MenuItem>
              )}
            </Menu>
            <Box sx={{ padding: 1 }}>
              <DarkModeButton></DarkModeButton>
            </Box>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {userData?.picture ? (
                <Avatar src={convertImage(userData.picture.data)} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            key={"home"}
            component="a"
            href="/home"
            disablePadding
            sx={{
              display: "block",
              textDecoration: "none",
              color: theme.palette.text.primary,
              "&:visited": {
                color: theme.palette.text.primary,
              },
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: "auto",
                      },
                ]}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Home"}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            key={"Surgery"}
            component="a"
            href="/surgeries"
            disablePadding
            sx={{
              display: "block",
              textDecoration: "none",
              color: theme.palette.text.primary,
              "&:visited": {
                color: theme.palette.text.primary,
              },
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: "auto",
                      },
                ]}
              >
                <LocalHospitalIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Surgery"}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            key={"ُEquipments"}
            component="a"
            href="/equipments"
            disablePadding
            sx={{
              display: "block",
              textDecoration: "none",
              color: theme.palette.text.primary,
              "&:visited": {
                color: theme.palette.text.primary,
              },
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: "auto",
                      },
                ]}
              >
                <VaccinesIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Equipments"}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            key={"open-slots"}
            component="a"
            href="/surgeries-open-slots"
            disablePadding
            sx={{
              display: "block",
              textDecoration: "none",
              color: theme.palette.text.primary,
              "&:visited": {
                color: theme.palette.text.primary,
              },
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: "auto",
                      },
                ]}
              >
                <MedicalServicesIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Home"}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
