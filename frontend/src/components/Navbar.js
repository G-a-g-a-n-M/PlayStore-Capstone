import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppBar, Toolbar, Typography, IconButton, TextField, InputAdornment, Box, Button, Avatar, Menu, MenuItem, Tooltip, Divider, useTheme, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { ColorModeContext } from "../App";
import API from "../services/api";

function Navbar({ onSearch }) {
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  const dispatch = useDispatch();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { isLoggedIn, role, token } = useSelector((state) => state.auth);

  const username = authService.getUsername();
  const email = authService.getEmail();

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await API.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleDeleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenNotifMenu = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleCloseNotifMenu = () => {
    setNotifAnchorEl(null);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleToggleTheme = () => {
    colorMode.toggleColorMode();
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    authService.logout();
    dispatch(logoutUser());
    window.location.href = "/login";
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff', boxShadow: 0, borderBottom: "1px solid", borderColor: theme.palette.mode === 'dark' ? '#333' : '#ddd' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: "bold", 
            color: theme.palette.mode === 'dark' ? '#fff' : 'primary.main', 
            textDecoration: "none" 
          }}
        >
          Play Store
        </Typography>

        <TextField
          size="small"
          placeholder="Search apps"
          value={search}
          onChange={handleChange}
          sx={{
            background: theme.palette.mode === 'dark' ? "#333" : "#f1f1f1",
            borderRadius: 1,
            marginRight: 2,
            width: { xs: "150px", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              color: theme.palette.mode === 'dark' ? "white" : "black",
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: "transparent" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {!isLoggedIn ? (
            <>
              <Button color="primary" component={Link} to="/login">Login</Button>
              <Button variant="contained" component={Link} to="/register">Register</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/installed-apps" sx={{ color: theme.palette.mode === 'dark' ? 'inherit' : 'text.primary' }}>My Apps</Button>
              {role === "owner" && (
                <Button color="inherit" component={Link} to="/owner/dashboard" sx={{ color: theme.palette.mode === 'dark' ? 'inherit' : 'text.primary' }}>Owner Dashboard</Button>
              )}
              
              <IconButton color="inherit" onClick={handleOpenNotifMenu} sx={{ color: theme.palette.mode === 'dark' ? 'inherit' : 'text.primary' }}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleCloseNotifMenu}
                PaperProps={{
                  sx: { width: 320, maxHeight: 400, mt: 1.5 }
                }}
              >
                <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
                  Notifications
                </Typography>
                <Divider />
                {notifications.length === 0 ? (
                  <MenuItem disabled>No notifications</MenuItem>
                ) : (
                  notifications.map((n) => (
                    <MenuItem key={n._id} sx={{ whiteSpace: 'normal', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {n.type === 'APP_UPDATE' ? '🚀 App Update' : '📥 New Download'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {n.message}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(n._id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </MenuItem>
                  ))
                )}
              </Menu>

              <Tooltip title="Account commands">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32, fontSize: "0.9rem" }}>
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled sx={{ opacity: "1 !important", color: "text.primary" }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseUserMenu} component={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem onClick={handleToggleTheme}>
                  {theme.palette.mode === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode'}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
