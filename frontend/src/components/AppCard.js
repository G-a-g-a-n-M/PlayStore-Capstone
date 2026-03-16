import { Card, CardContent, CardActions, Typography, Button, Rating, Box, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AppCard = ({ app, onInstall, isInstalled }) => {
  const navigate = useNavigate();
  const placeholderImage = "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop";

  return (
    <Card 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        cursor: "pointer",
        position: 'relative',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          transform: 'translateY(-4px)',
          '& .card-media': {
            transform: 'scale(1.05)',
          }
        }
      }}
      onClick={() => navigate(`/app/${app._id}`)}
    >
      <Box sx={{ overflow: 'hidden', height: 140 }}>
        <CardMedia
          className="card-media"
          component="img"
          height="140"
          image={app.imageUrl || placeholderImage}
          alt={app.name}
          sx={{ 
            transition: 'transform 0.4s ease',
            objectFit: 'cover'
          }}
        />
      </Box>

      <CardContent sx={{ p: 1.5, flexGrow: 1, '&:last-child': { pb: 1.5 } }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#fff', 
            fontWeight: 'bold', 
            lineHeight: 1.2,
            mb: 0.5,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {app.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Rating
            value={app.rating || 0}
            precision={0.5}
            readOnly
            size="small"
            sx={{ mr: 0.5, color: '#ffc107', fontSize: '0.8rem' }}
          />
          <Typography variant="caption" sx={{ color: 'gray' }}>
            ({app.rating?.toFixed(1) || "0.0"})
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', fontSize: '0.7rem' }}>
          {app.genre}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 1.5, pt: 0, justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/${app._id}`);
          }}
          sx={{ 
            fontSize: '0.65rem', 
            py: 0.5,
            borderColor: 'rgba(255,255,255,0.1)',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main'
            }
          }}
        >
          Details
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
            sx={{ 
              fontSize: '0.65rem',
              py: 0.5,
              minWidth: '60px'
            }}
          >
            {isInstalled ? "Done" : "Install"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default AppCard;
