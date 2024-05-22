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
        photo: null,
        photo_url: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [apiError, setApiError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handlePasswordChangeClick = () => {
        setIsChangingPassword(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('username', profile.username);
        formData.append('email', profile.email);
        formData.append('first_name', profile.first_name);
        formData.append('last_name', profile.last_name);
        formData.append('phone_number', profile.phone_number);

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
        const errorMessage = error.response?.data?.detail || 'There was an error updating the profile.';
        setApiError(errorMessage);
        alert(errorMessage);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setError('Your password must contain at least 8 characters.');
            return;
        }
        if (/^\d+$/.test(password)) {
            setError('Your password can’t be entirely numeric.');
            return;
        }
        if (password.toLowerCase().includes(profile.username.toLowerCase()) ||
            password.toLowerCase().includes(profile.email.toLowerCase()) ||
            password.toLowerCase().includes(profile.first_name.toLowerCase()) ||
            password.toLowerCase().includes(profile.last_name.toLowerCase()) ||
            password.toLowerCase().includes(profile.phone_number)) {
            setError('Your password can’t be too similar to your other personal information.');
            return;
        }

        const commonPasswords = ['password', '123456', '123456789', '12345678', '12345', '1234567', 'qwerty'];
        if (commonPasswords.includes(password)) {
            setError('Your password can’t be a commonly used password.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');

        const formData = new FormData();
        formData.append('password', password);

        try {
            const response = await axios.put('http://127.0.0.1:8000/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            console.log('Password changed successfully:', response.data);
            alert('Password changed successfully');
            setIsChangingPassword(false);
        } catch (error) {
            console.error('There was an error changing the password:', error.response || error.message);
            setError(error.response?.data?.detail || 'There was an error changing the password.');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsChangingPassword(false);
        setError('');
        setApiError('');
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
                    {!isEditing && !isChangingPassword && (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><b>Username:</b> {profile.username}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><b>Email:</b> {profile.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><b>First Name:</b> {profile.first_name}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><b>Last Name:</b> {profile.last_name}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><b>Phone Number:</b> {profile.phone_number}</Typography>
                                </Grid>
                            </Grid>
                            <Button variant="contained" color="primary" onClick={handleEditClick} sx={{ mt: 3 }}>
                                Edit Profile
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handlePasswordChangeClick} sx={{ mt: 3, ml: 2 }}>
                                Change Password
                            </Button>
                        </>
                    )}
                    {isEditing && (
                        <Box component="form" onSubmit={handleSave} noValidate sx={{ mt: 1 }}>
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
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCancel}
                                        sx={{ mt: 3, ml: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    {isChangingPassword && (
                        <Box component="form" onSubmit={handlePasswordSubmit} noValidate sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="password"
                                        label="New Password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="confirmPassword"
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
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
                                        Change Password
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCancel}
                                        sx={{ mt: 3, ml: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </Container>
        </DefaultLayout>
    );
};

export default Profile;









