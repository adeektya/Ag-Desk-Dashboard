import React, { useState } from 'react';
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
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  CssBaseline,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from './api';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff5722',
    },
  },
});

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [userRole, setUserRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    switch (prop) {
      case 'name':
        setName(event.target.value);
        break;
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'invitationCode':
        setInvitationCode(event.target.value);
        break;
      case 'contactNumber':
        setContactNumber(event.target.value);
        break;
      case 'startDate':
        setStartDate(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      username: name,
      email: email,
      password: password,
      invitation_code: invitationCode,
      is_owner: userRole === 'owner',
      is_employee: userRole === 'employee',
      ...(userRole === 'owner' ? { invitation_code: invitationCode } : {}),
      ...(userRole === 'employee'
        ? {
            employee_profile: {
              role: 'employee',
              contactNumber: contactNumber,
              section: 'A',
              start_date: startDate,
              salary: '0',
              status: 'Active',
            },
          }
        : {}),
    };

    try {
      const response = await registerUser(userData);
      console.log('Registration successful:', response);
      navigate('/signin');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4 }}>
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
                  Welcome to Ag-Desk
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Join us and optimize your farm management.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={handleChange('name')}
                  />
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
                  <RadioGroup
                    row
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    sx={{ mt: 2 }}
                  >
                    <FormControlLabel
                      value="owner"
                      control={<Radio />}
                      label="Owner"
                    />
                    <FormControlLabel
                      value="employee"
                      control={<Radio />}
                      label="Employee"
                    />
                  </RadioGroup>
                  <TextField
                    label="Invitation Code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={invitationCode}
                    onChange={handleChange('invitationCode')}
                  />
                  {userRole === 'employee' && (
                    <>
                      <TextField
                        label="Contact Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={contactNumber}
                        onChange={handleChange('contactNumber')}
                      />
                      <TextField
                        label="Start Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={handleChange('startDate')}
                      />
                    </>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Create Account
                  </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link
                      to="/signin"
                      style={{ color: theme.palette.primary.main }}
                    >
                      Login here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
