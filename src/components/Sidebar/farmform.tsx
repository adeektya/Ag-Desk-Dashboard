import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const FarmFormDialog = ({
  open,
  handleClose,
  handleSubmit,
  handleDelete,
  initialData,
}) => {
  const [formData, setFormData] = useState({ name: '', address: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name, address: initialData.address });
    } else {
      setFormData({ name: '', address: '' }); // Reset form data when closed or opened without initial data
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    handleSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Edit Farm' : 'Add Farm'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Farm Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="address"
          label="Farm Address"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleFormSubmit} color="primary">
          {initialData ? 'Update' : 'Add'}
        </Button>
        {initialData && (
          <Button
            onClick={handleDelete}
            color="secondary"
            style={{ marginLeft: 'auto' }}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FarmFormDialog;
