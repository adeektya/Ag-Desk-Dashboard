import React, { useState } from 'react';
import { Button, Dialog, TextField, Snackbar, Alert, Typography, Grid } from '@mui/material';
import { generateInvitationCode } from './api'; // You will define this API call

export const GenerateCodeSection = () => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGenerateCode = async () => {
    try {
      const newCode = await generateInvitationCode(); // Assume this function makes the API call and returns the code
      setGeneratedCode(newCode);
      setSnackbarMessage('Invitation code generated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to generate code. Please try again.');
      setOpenSnackbar(true);
      console.error('Error generating invitation code:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleGenerateCode}>
        Generate Invitation Code
      </Button>
      {generatedCode && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Generated Code: {generatedCode}
        </Typography>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

