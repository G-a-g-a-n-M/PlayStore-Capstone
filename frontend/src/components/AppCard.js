import React from "react";
import { Card, CardContent, CardActions, Typography, Button, Rating, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AppCard = ({ app, onInstall, isInstalled }) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: "pointer",
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          transform: 'translateY(-4px)',
        }
      }}
      onClick={() => navigate(`/app/${app._id}`)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
          {app.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: '3em' }}>
          {app.description?.slice(0, 80)}{app.description?.length > 80 ? '...' : ''}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={app.rating || 0}
            precision={0.5}
            readOnly
            size="small"
            sx={{ mr: 1, color: '#ffc107' }}
          />
          <Typography variant="body2" sx={{ color: 'gray' }}>
            ({app.rating?.toFixed(1) || "N/A"})
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', display: 'block' }}>
          {app.genre} • Version: {app.version}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/${app._id}`);
          }}
          sx={{ color: 'primary.main' }}
        >
          View Details
        </Button>
        {onInstall && (
          <Button
            size="small"
            variant="contained"
            disabled={isInstalled}
            onClick={(e) => {
              e.stopPropagation();
              onInstall(app._id);
            }}
            sx={{ ml: 'auto' }}
          >
            {isInstalled ? "Installed" : "Install"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default AppCard;
