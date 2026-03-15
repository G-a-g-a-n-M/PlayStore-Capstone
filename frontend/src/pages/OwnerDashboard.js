import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Divider, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  Collapse,
  Paper
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Update as UpdateIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Star as StarIcon,
  FileDownload as DownloadIcon,
  Apps as AppsIcon
} from "@mui/icons-material";

function OwnerDashboard() {
  const { token } = useSelector((state) => state.auth);
  const [apps, setApps] = useState([]);
  const [reviewsMap, setReviewsMap] = useState({});
  const [expandedApp, setExpandedApp] = useState(null);

  const fetchApps = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/apps/my-apps",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      setApps(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [token]);

  const deleteApp = async (id) => {
    if (!window.confirm("Are you sure you want to delete this app?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/apps/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchApps();
    } catch (err) {
      console.log(err);
    }
  };

  const announceUpdate = async (appId) => {
    const version = prompt("Enter new version");
    if (!version) return;

    try {
      await axios.post(
        "http://localhost:5000/api/apps/announce-update",
        {
          appId,
          version
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Users notified!");
      fetchApps();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleVisibility = async (app) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/apps/${app._id}/visibility`,
        {
          visibility:
            app.visibility === "public"
              ? "private"
              : "public"
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      fetchApps();
    } catch(err){
      console.log(err);
    }
  };

  const toggleReviews = async (appId) => {
    if (expandedApp === appId) {
      setExpandedApp(null);
      return;
    }

    setExpandedApp(appId);

    if (!reviewsMap[appId]) {
      try {
        const res = await axios.get(`http://localhost:5000/api/apps/${appId}/reviews`);
        setReviewsMap(prev => ({
          ...prev,
          [appId]: res.data.reviews || res.data
        }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const totalApps = apps.length;
  const totalDownloads = apps.reduce((sum, app) => sum + (app.downloads || 0), 0);
  const ratedApps = apps.filter(app => app.rating > 0);
  const averageRating = ratedApps.length > 0
    ? (ratedApps.reduce((sum, app) => sum + app.rating, 0) / ratedApps.length).toFixed(1)
    : "N/A";

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <BackButton />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Owner Dashboard
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => window.location.href="/owner/add-app"}
            sx={{ px: 3, py: 1, borderRadius: 2 }}
          >
            Add New App
          </Button>
        </Box>

        {/* Analytics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
              <CardContent>
                <AppsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">{totalApps}</Typography>
                <Typography color="text.secondary">Total Apps</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
              <CardContent>
                <DownloadIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">{totalDownloads}</Typography>
                <Typography color="text.secondary">Total Downloads</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
              <CardContent>
                <StarIcon sx={{ fontSize: 40, mb: 1, color: '#ffc107' }} />
                <Typography variant="h4" fontWeight="bold">{averageRating}</Typography>
                <Typography color="text.secondary">Average Rating</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Your Applications
        </Typography>

        {apps.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary">
              You haven't added any apps yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {apps.map((app) => (
              <Grid item xs={12} key={app._id}>
                <Card sx={{ borderRadius: 3, overflow: 'visible' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{app.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {app.genre} • Version {app.version}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DownloadIcon fontSize="inherit" /> {app.downloads || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon fontSize="inherit" sx={{ color: '#ffc107' }} /> {app.rating?.toFixed(1) || "N/A"}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              bgcolor: app.visibility === 'public' ? 'success.main' : 'warning.main',
                              color: 'white',
                              px: 1,
                              borderRadius: 1,
                              textTransform: 'uppercase',
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {app.visibility}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />}
                          onClick={() => window.location.href=`/owner/edit-app/${app._id}`}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteApp(app._id)}
                        >
                          Delete
                        </Button>
                        <Button 
                          size="small" 
                          color="info"
                          startIcon={app.visibility === 'public' ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          onClick={() => toggleVisibility(app)}
                        >
                          {app.visibility === 'public' ? "Hide" : "Show"}
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<UpdateIcon />}
                          onClick={() => announceUpdate(app._id)}
                        >
                          Update
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained"
                          endIcon={expandedApp === app._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          onClick={() => toggleReviews(app._id)}
                        >
                          Reviews
                        </Button>
                      </Box>
                    </Box>

                    <Collapse in={expandedApp === app._id} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                          Recent Reviews
                        </Typography>
                        {!reviewsMap[app._id] || reviewsMap[app._id].length === 0 ? (
                          <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
                        ) : (
                          <List disablePadding>
                            {reviewsMap[app._id].map((r, index) => (
                              <ListItem key={r._id} disableGutters sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: index !== reviewsMap[app._id].length - 1 ? 2 : 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, width: '100%' }}>
                                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                    {r.userId?.name?.charAt(0) || "A"}
                                  </Avatar>
                                  <ListItemText 
                                    primary={r.userId?.name || "Anonymous User"} 
                                    secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center', color: '#ffc107' }}>{r.rating} <StarIcon fontSize="inherit" /></Box>}
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ ml: 4 }}>{r.comment}</Typography>
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default OwnerDashboard;