import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";

import { Container, Typography, Button } from "@mui/material";

function AppDetails() {

  const { id } = useParams();

  const [app, setApp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [installed, setInstalled] = useState(false);
  const { isLoggedIn, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/apps/${id}/reviews`);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.log(err);
      }
    };

    const checkInstallation = async () => {
      try {
        if (!isLoggedIn) return;
        const res = await axios.get(
          `http://localhost:5000/api/apps/${id}/installed`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setInstalled(res.data.installed);
      } catch (err) {
        console.log(err);
      }
    };

    API.get(`/apps/${id}`)
      .then((res) => {
        setApp(res.data);
      })
      .catch((err) => console.log(err));

    fetchReviews();
    checkInstallation();

  }, [id, isLoggedIn]);

  const downloadApp = async () => {
    try {
      const res = await API.post(
        `/apps/${id}/download`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );
      if (res.data.message === "App already installed") {
          alert("App already installed");
          setInstalled(true);
          return;
      }
      alert("App Installed!");
      setInstalled(true);
      setApp({
        ...app,
        downloads: res.data.downloads
      });
    } catch (error) {
      console.log("DOWNLOAD ERROR:", error.response?.data || error);
    }
  };

  const uninstallApp = async () => {
    try {
      await API.delete(`/apps/${id}/uninstall`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      alert("App Uninstalled!");
      setInstalled(false);
    } catch (error) {
      console.log("UNINSTALL ERROR:", error.response?.data || error);
    }
  };

  const submitReview = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/apps/${id}/review`,
        {
          rating,
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setComment("");
      setRating(5);
      
      const res = await axios.get(`http://localhost:5000/api/apps/${id}/reviews`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.log(err);
    }
  };

  if (!app) return <p>Loading...</p>;

  return (
    <div>

      <Navbar />

      <Container sx={{ marginTop: 3 }}>
        <BackButton />

        <Typography variant="h4">
          {app.name}
        </Typography>

        <Typography variant="body1">
          {app.description}
        </Typography>

        <Typography>
          ⭐ {app.rating}
        </Typography>

        <Typography>
          Genre: {app.genre}
        </Typography>

        <Typography>
          Version: {app.version}
        </Typography>

        <Typography>
          Downloads: {app.downloads || 0}
        </Typography>

        {isLoggedIn ? (
          <Button
            variant="contained"
            color={installed ? "error" : "success"}
            sx={{ marginTop: 2 }}
            onClick={installed ? uninstallApp : downloadApp}
          >
            {installed ? "Uninstall" : "Install"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2 }}
            onClick={() => window.location.href="/login"}
          >
            Log in to Install
          </Button>
        )}

        <div style={{ marginTop: "40px" }}>
          <Typography variant="h5">Reviews</Typography>
          
          <div style={{ marginBottom: "20px", marginTop: "10px" }}>
            <select value={rating} onChange={(e)=>setRating(e.target.value)} style={{ marginRight: "10px", padding: "5px" }}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            
            <textarea
              placeholder="Write a review..."
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              style={{ width: "100%", marginTop: "10px", padding: "10px" }}
            />
            
            <Button 
              variant="contained" 
              onClick={submitReview}
              sx={{ marginTop: 1 }}
            >
              Submit Review
            </Button>
          </div>
          
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r._id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
                <strong>{r.userId?.name || "Unknown User"}</strong>
                <p style={{ margin: "5px 0" }}>Rating: {r.rating} ⭐</p>
                <p style={{ margin: "0" }}>{r.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

      </Container>

    </div>
  );
}

export default AppDetails;
