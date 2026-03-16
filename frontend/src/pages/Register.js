import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  Link as MuiLink,
  Grid,
  Alert
} from "@mui/material";
import { 
  PersonAddOutlined as PersonAddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from "@mui/icons-material";
import { useState } from "react";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    try {
      await axios.post("https://playstore-capstone.onrender.com/api/auth/register", {
        ...values,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)" 
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Box sx={{ p: 2 }}>
        <BackButton />
      </Box>

      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              width: "100%",
              backdropFilter: "blur(10px)",
              backgroundColor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? "rgba(30, 30, 30, 0.8)" 
                  : "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}>
              <PersonAddIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
              Create Account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                role: "user",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
                <Form style={{ width: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Full Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        InputProps={{
                          startAdornment: <LockIcon sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ 
                      mt: 4, 
                      mb: 2, 
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: 3
                    }}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{" "}
                      <MuiLink component={Link} to="/login" variant="body2" fontWeight="bold">
                        Login here
                      </MuiLink>
                    </Typography>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;
