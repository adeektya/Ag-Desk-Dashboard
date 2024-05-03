import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { registerEmployee } from './api';

const EmployeeRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleChange =
    (prop: 'name' | 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (prop === 'name') setName(event.target.value);
      else if (prop === 'email') setEmail(event.target.value);
      else if (prop === 'password') setPassword(event.target.value);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const employeeData = { username: name, email, password };

    try {
      const response = await registerEmployee(employeeData);
      console.log('Employee data', employeeData)
      console.log('Employee registration successful:', response);
      navigate('/login'); // Redirect to the desired page after successful registration
    } catch (error) {
      console.error('Employee registration failed:', error);
      alert('Employee registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Employee Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleChange('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={handleChange('password')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default EmployeeRegistration;
