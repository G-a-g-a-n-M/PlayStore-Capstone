import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import AppCard from "../components/AppCard"; // Moved to be with other component imports
import { Box, Typography, Container, Tabs, Tab } from "@mui/material";

function Home() {
  const [apps, setApps] = useState([]);
  const [allApps, setAllApps] = useState([]); // Keep a backup for quick resetting
  const [category, setCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);

  const fetchApps = useCallback(() => {
    let url = "/apps";
    if (minRating > 0) {
      url = `/apps/filter?rating=${minRating}`;
    }
    
    API.get(url)
      .then((res) => {
        const results = res.data.apps || res.data;
        setApps(results);
        setAllApps(results);
      })
      .catch((err) => console.log(err));
  }, [minRating]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const searchApps = async (query) => {
    if (!query.trim()) {
      setApps(allApps); // Reset to original list if search is empty
      return;
    }

    try {
      const res = await API.get(`/apps/search?name=${query}`);
      const results = res.data.apps || (Array.isArray(res.data) ? res.data : []);
      setApps(results);
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  const loadCategory = async (genre) => {
    try {
      setCategory(genre);
      let url = "/apps";
      
      if (genre !== "all") {
        url = `/apps/category/${genre}`;
      }
      
      const res = await API.get(url);
      let results = res.data.apps || res.data;
      
      if (minRating > 0) {
         results = results.filter(app => app.rating >= minRating);
      }
      
      setApps(results);
    } catch (error) {
      console.log("Category error:", error);
    }
  };

  const handleRatingChange = async (e) => {
    const ratingValue = Number(e.target.value);
    setMinRating(ratingValue);
    setCategory("all"); // reset category when filtering by rating globally
  };

  return (
    <div>
      <Navbar onSearch={searchApps} />

      <Container sx={{ mt: 4 }}>
        <Tabs
          value={category}
          onChange={(e, val) => loadCategory(val)}
          sx={{ 
            marginBottom: 3,
            "& .MuiTab-root": { color: "gray" },
            "& .Mui-selected": { color: "primary.main" },
            "& .MuiTabs-indicator": { backgroundColor: "primary.main" }
          }}
        >
          <Tab label="For You" value="all" />
          <Tab label="Games" value="games" />
          <Tab label="Beauty" value="beauty" />
          <Tab label="Fashion" value="fashion" />
          <Tab label="Women" value="women" />
          <Tab label="Health" value="health" />
          <Tab label="Food" value="food" />
          <Tab label="Social" value="social" />
          <Tab label="Education" value="education" />
        </Tabs>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Typography variant="h4" sx={{ 
            fontWeight: '900', 
            background: 'linear-gradient(45deg, #fff 30%, #aaa 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            Explore Apps
          </Typography>

          <div style={{ display: "flex", alignItems: "center" }}>
             <Typography sx={{ marginRight: 2, color: 'gray', display: { xs: 'none', sm: 'block' } }}>Filter by:</Typography>
             <select 
              value={minRating} 
              onChange={handleRatingChange}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "8px", 
                border: "1px solid #333", 
                backgroundColor: "#1e1e1e", 
                color: "#fff",
                outline: 'none',
                cursor: 'pointer'
              }}
             >
                <option value={0}>All Ratings</option>
                <option value={1}>1+ ⭐</option>
                <option value={2}>2+ ⭐</option>
                <option value={3}>3+ ⭐</option>
                <option value={4}>4+ ⭐</option>
                <option value={4.5}>4.5+ ⭐</option>
             </select>
          </div>
        </div>

        {apps.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 5, color: 'gray' }}>
            No apps found matching your criteria.
          </Typography>
        ) : (
          <Box sx={{ 
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)", // 2 columns on mobile
              sm: "repeat(auto-fill, minmax(180px, 1fr))", // Adaptive on larger
              md: "repeat(auto-fill, minmax(200px, 1fr))"
            },
            gap: { xs: 2, sm: 3 },
            pb: 4
          }}>
            {apps.map((app) => (
              <AppCard key={app._id} app={app} />
            ))}
          </Box>
        )}
      </Container>
    </div>
  );
}

export default Home;