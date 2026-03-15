import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(-1)}
      sx={{ marginBottom: 2, color: "gray" }}
    >
      Go Back
    </Button>
  );
};

export default BackButton;
