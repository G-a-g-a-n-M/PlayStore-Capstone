import React, { useState, createContext, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./pages/Home";
import AppDetails from "./pages/AppDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddApp from "./pages/AddApp";
import EditApp from "./pages/EditApp";
import Notifications from "./pages/Notifications";
import MyApps from "./pages/MyApps";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerDashboard from "./pages/OwnerDashboard";
import Profile from "./pages/Profile";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState('dark');
  
  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  }), []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#fff',
      },
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app/:id" element={<AppDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute roleRequired="owner">
                  <OwnerDashboard/>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/owner/add-app"
              element={
                <ProtectedRoute roleRequired="owner">
                  <AddApp/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/edit-app/:id"
              element={
                <ProtectedRoute roleRequired="owner">
                  <EditApp/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/installed-apps"
              element={
                <ProtectedRoute>
                  <MyApps/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
