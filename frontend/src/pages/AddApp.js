import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem
} from "@mui/material";

function AddApp() {

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [genre,setGenre] = useState("");
  const [version,setVersion] = useState("");
  const [imageUrl,setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://playstore-capstone.onrender.com/api/apps",
        { name, description, genre, version, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/owner/dashboard");
    } catch(err){
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 10 }}>
      <BackButton />
      
      <Paper 
        elevation={24} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          mt: 3,
          backgroundColor: 'rgba(30, 30, 30, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #primary-main 30%, #fff 90%)',
            WebkitBackgroundClip: 'text',
            mb: 4 
          }}
        >
          Add New App
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <TextField
              required
              fullWidth
              label="App Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              required
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              fullWidth
              label="Image URL (Unsplash)"
              variant="outlined"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />

            <FormControl fullWidth required>
              <InputLabel id="genre-label">Genre</InputLabel>
              <Select
                labelId="genre-label"
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
              >
                <MenuItem value="games">Games</MenuItem>
                <MenuItem value="beauty">Beauty</MenuItem>
                <MenuItem value="fashion">Fashion</MenuItem>
                <MenuItem value="women">Women</MenuItem>
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="social">Social</MenuItem>
                <MenuItem value="education">Education</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              label="Version"
              variant="outlined"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={loading}
              sx={{ 
                mt: 2, 
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2
              }}
            >
              {loading ? "Creating..." : "Create App"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default AddApp;
