import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Avatar, Grid, Paper } from '@mui/material';
import axios from 'axios';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const Profile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        photo: null,
        photo_url: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [apiError, setApiError] = useState(''); // To store API errors

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/profile/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setProfile({
                ...response.data,
                photo_url: response.data.photo
            });
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error fetching the profile!', error);
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfile({
            ...profile,
            photo: file,
            photo_url: URL.createObjectURL(file)
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(profile.email)) {
            setError('Invalid email address');
            return;
        }
    
        if (profile.password) {
            if (profile.password.length < 8) {
                setError('Your password must contain at least 8 characters.');
                return;
            }
            if (/^\d+$/.test(profile.password)) {
                setError('Your password can’t be entirely numeric.');
                return;
            }
            if (profile.password.toLowerCase().includes(profile.username.toLowerCase()) ||
                profile.password.toLowerCase().includes(profile.email.toLowerCase()) ||
                profile.password.toLowerCase().includes(profile.first_name.toLowerCase()) ||
                profile.password.toLowerCase().includes(profile.last_name.toLowerCase()) ||
                profile.password.toLowerCase().includes(profile.phone_number)) {
                setError('Your password can’t be too similar to your other personal information.');
                return;
            }
    
            // List of commonly used passwords (example)
            const commonPasswords = ['password', '123456', '123456789', '12345678', '12345', '1234567', 'qwerty'];
            if (commonPasswords.includes(profile.password)) {
                setError('Your password can’t be a commonly used password.');
                return;
            }
    
            if (profile.password !== profile.confirm_password) {
                setError('Passwords do not match');
                return;
            }
        }
    
        const formData = new FormData();
    
        if (profile.username) {
            formData.append('username', profile.username);
        }
    
        formData.append('email', profile.email);
        formData.append('first_name', profile.first_name);
        formData.append('last_name', profile.last_name);
        formData.append('phone_number', profile.phone_number);
    
        // Only append the password if it's not empty
        if (profile.password) {
            formData.append('password', profile.password);
        }
    
        // Only append the photo if it's available and has changed
        if (profile.photo && profile.photo instanceof File) {
            formData.append('photo', profile.photo);
        }
    
        try {
            const response = await axios.put('http://127.0.0.1:8000/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
    
            console.log('Profile updated successfully:', response.data);
            alert('Profile updated successfully');
            window.location.reload();
        } catch (error) {
            console.error('There was an error updating the profile:', error.response || error.message);
            setError(error.response?.data?.detail || 'There was an error updating the profile.');
        }
    };
    
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="User Profile" />
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            src={profile.photo_url || '/static/images/avatar/1.jpg'}
                            sx={{ width: 120, height: 120, cursor: 'pointer' }}
                            onClick={() => document.getElementById('photo-upload').click()}
                        />
                        <input
                            id="photo-upload"
                            accept="image/*"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Typography variant="h5" sx={{ mt: 2 }}>{`${profile.first_name} ${profile.last_name}`}</Typography>
                        <Typography variant="body2" color="textSecondary">@{profile.username}</Typography>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={profile.username}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="first_name"
                                    label="First Name"
                                    name="first_name"
                                    value={profile.first_name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="last_name"
                                    label="Last Name"
                                    name="last_name"
                                    value={profile.last_name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="phone_number"
                                    label="Phone Number"
                                    name="phone_number"
                                    value={profile.phone_number}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={profile.password}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="confirm_password"
                                    label="Confirm Password"
                                    name="confirm_password"
                                    type="password"
                                    value={profile.confirm_password}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {error && (
                                <Grid item xs={12}>
                                    <Typography color="error">{error}</Typography>
                                </Grid>
                            )}
                            {apiError && (
                                <Grid item xs={12}>
                                    <Typography color="error">{apiError}</Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3 }}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </DefaultLayout>
    );
};

export default Profile;






