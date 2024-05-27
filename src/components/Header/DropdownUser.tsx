import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Logout, Person, Message, Settings } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config';  // Adjust the path as needed

const DropdownUser = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data
    axios.get(`${BASE_URL}/profile/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`  // Adjust based on your authentication method
      }
    })
    .then(response => {
      setUserPhoto(response.data.photo);
    })
    .catch(error => {
      console.error('There was an error fetching the profile!', error);
    });
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin'); // Adjust this route to your login route
    handleClose();
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }} src={userPhoto} alt="User" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownUser;
