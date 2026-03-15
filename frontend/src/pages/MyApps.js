import React, { useEffect, useState } from "react";
import axios from "axios";
import AppCard from "../components/AppCard";
import { Container, Typography, Grid } from "@mui/material";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";

function MyApps() {
  const [apps, setApps] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/apps/user/installed-apps",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setApps(res.data);
      } catch (error) {
        console.log("Error fetching installed apps:", error);
      }
    };

    fetchApps();
  }, [token]);

  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <BackButton />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Installed Apps
        </Typography>

      {apps.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 5, color: 'gray' }}>
          No apps installed yet.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {apps.map((app) => (
            app && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app._id}>
                <AppCard app={app} />
              </Grid>
            )
          ))}
        </Grid>
      )}
    </Container>
    </div>
  );
}

export default MyApps;
