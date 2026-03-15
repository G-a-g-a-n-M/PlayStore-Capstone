import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, TextField, Button, Box, Avatar, Divider, Alert, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import API from "../services/api";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }
    try {
      await API.put("/auth/change-password", 
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update password" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <BackButton />
        <Card sx={{ mt: 2, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ bgcolor: 'primary.main', height: 100, display: 'flex', alignItems: 'flex-end', px: 3, pb: 2 }}>
             <Avatar sx={{ width: 80, height: 80, border: '4px solid white', bgcolor: '#1976d2', fontSize: '2rem', mb: -5 }}>
               {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
             </Avatar>
          </Box>
          <CardContent sx={{ pt: 6 }}>
            <Typography variant="h5" fontWeight="bold">
              {profile?.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {profile?.email}
            </Typography>
            <Box sx={{ mt: 1, px: 1.5, py: 0.5, bgcolor: 'action.hover', borderRadius: 1, display: 'inline-block' }}>
               <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                 {profile?.role}
               </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom fontWeight="bold">
              Change Password
            </Typography>
            
            {message.text && (
              <Alert severity={message.type} sx={{ mb: 2 }}>
                {message.text}
              </Alert>
            )}

            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                label="Old Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Profile;
