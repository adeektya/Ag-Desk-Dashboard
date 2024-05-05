import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './api';
import { useAuth } from '../../contexts/AuthContext';

const password = ''; // Declare the password variable
const email = ''; // Declare the email variable

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange =
    (prop: 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (prop === 'email') setEmail(event.target.value);
      else setPassword(event.target.value);
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password.'); // Replace with Snackbar for better UX
      return;
    }

    try {
      const userData = { email, password };
      const response = await loginUser(userData);
      console.log('Login successful:', response);
      if (response.token) {
        login(response.token);
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.'); // Consider using a snackbar for error handling
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      login(token);
      navigate('/'); // redirect to the dashboard or home page
    }
  }, [login, navigate]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          p: 4,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Typography variant="h4" component="h2" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                suspendisse.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Sign In
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={handleChange('email')}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleChange('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Sign In
                </Button>
              </form>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Or sign in with
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<GoogleIcon />}
                  sx={{ mt: 1 }}
                >
                  Sign in with Google
                </Button>
              </Box>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ color: 'primary.main' }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignIn;
