import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Paper,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useFarm } from '../../contexts/FarmContext';

const InventoryPage = () => {
  const { activeFarm } = useFarm();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    item_type: '',
    quantity: '',
    status: '',
    last_service_date: '',
    service_details: '',
    next_service_date: '',

  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const fetchInventory = async () => {
    if (!activeFarm) {
      console.log('No active farm selected.');
      return;
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/inventory/?farm_id=${activeFarm.id}`,
        {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        }
      );
      setRows(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory for farm:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [activeFarm]); // Refetch whenever the activeFarm changes

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false); 
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    // Check if the field is a date field and if the value is empty

    setFormData({
      ...formData,
      [name]: value, // Update the specific field based on input
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`; // Formats date as YYYY-MM-DD
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const todayDate = getTodayDate();
    const updatedFormData = {
      ...formData,
      farm: activeFarm.id,
      last_service_date: formData.last_service_date || todayDate, // Default if empty
      next_service_date: formData.next_service_date || todayDate, // Default if empty
    };
    try {
      // Check for empty required fields
      if (
        !formData.item_type ||
        !formData.name ||
        (formData.last_service_date && !formData.next_service_date)
      ) {
        throw new Error('Please fill all required fields.');
      }

      // Submit the data
      const response = await axios.post(
        'http://127.0.0.1:8000/inventory/',
        updatedFormData
      );
      setRows([...rows, response.data]);
      handleClose();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error(
          'Request failed with status code:',
          error.response.status
        );
        console.error('Error response:', error.response.data);
        alert(
          `Request failed with status code: ${
            error.response.status
          }\n${JSON.stringify(error.response.data)}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        alert('No response received from the server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error setting up request:', error.message);
        alert(`Error setting up request: ${error.message}`);
      }

      // Display specific field errors
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === 'object'
      ) {
        const fieldErrors = Object.entries(
          error.response.data as Record<string, { string: string }[]>
        ).map(([field, errors]) => {
          return `${field}: ${errors.map((error) => error.string).join(', ')}`;
        });
        alert(`Field errors:\n${fieldErrors.join('\n')}`);
      }
    }
  };

  const handleEditOpen = (row) => {
    setEditMode(true);
    setEditingRow(row);
    setFormData(row);
    setOpen(true);
  };

  const handleUpdate = async (event, id) => {
    event.preventDefault();
    console.log('Updating ID:', id); // Ensure the ID is being passed correctly
    if (id) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/inventory/${id}/`,
          formData
        );
        const updatedRows = rows.map((row) =>
          row.id === id ? response.data : row
        );
        setRows(updatedRows);
        handleClose();
      } catch (error) {
        console.error('Failed to update inventory item', error);
      }
    } else {
      console.error('Invalid ID');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/inventory/${id}/`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Failed to delete inventory item', error);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      console.log('No items selected for deletion.');
      return; // Early return if no items are selected
    }

    const deletePromises = selectedRows.map((id) =>
      axios
        .delete(`http://127.0.0.1:8000/inventory/${id}/`)
        .then(() => ({ success: true, id }))
        .catch((error) => ({
          success: false,
          id,
          error: error.message || 'Failed to delete item',
        }))
    );

    const optionPromises = selectedRows.map((id) =>
      axios
        .options(`http://127.0.0.1:8000/inventory/${id}/`)
        .then(() => ({ success: true, id }))
        .catch((error) => ({
          success: false,
          id,
          error: error.message || 'Failed to send OPTIONS request',
        }))
    );

    try {
      // Send OPTIONS requests first
      await Promise.all(optionPromises);

      // Then send DELETE requests
      const deleteResults = await Promise.all(deletePromises);
      const failedDeletes = deleteResults.filter((result) => !result.success);
      if (failedDeletes.length > 0) {
        console.error('Some items failed to delete:', failedDeletes);
        alert('Failed to delete some items.');
      }

      // Update the rows removing only the successfully deleted ones
      const deletedIds = deleteResults
        .filter((result) => result.success)
        .map((result) => result.id);
      setRows((currentRows) =>
        currentRows.filter((row) => !deletedIds.includes(row.id))
      );
      setSelectedRows([]);

      if (failedDeletes.length === 0) {
        alert('All selected items were successfully deleted.');
      }
    } catch (error) {
      console.error('Error processing deletions:', error);
    }
  };

  // Optional: Confirmation dialog state
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const inventoryTypes = [
    'seeds',
    'fertilizers',
    'feed',
    'tools',
    'machinery',
    'vehicles',
  ];
  const statusOptions = ['operational', 'needs repair', 'service due'];

  const columns = [
    { field: 'name', headerName: 'Inventory Name', width: 150 },
    { field: 'item_type', headerName: 'Inventory Type', width: 130 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'last_service_date', headerName: 'Last Service Date', width: 150 },
    { field: 'service_details', headerName: 'Service Details', width: 150 },
    {
      field: 'next_service_date',
      headerName: 'Next Service Due Date',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => handleEditOpen(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.id)}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Inventory Management" />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ mb: 2, mr: 1 }} // Added right margin
          >
            Add Inventory Item
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenConfirmDialog}
            disabled={selectedRows.length === 0}
            sx={{ mb: 2 }}
          >
            Delete Selected
          </Button>

          <Paper
            style={{ height: 400, width: '100%' }}
            className="data-grid-container"
          >
            <DataGrid
              rows={rows}
              columns={columns}
              autoPageSize
              pagination // Enable pagination
              paginationMode="client" // Set pagination mode to client or server
              checkboxSelection
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectedRows(newSelectionModel);
              }}
              rowSelectionModel={selectedRows}
            />
          </Paper>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={editMode ? handleClose : handleClose}
            aria-labelledby="inventory-dialog"
            className="dialog-content"
          >
            <DialogTitle id="inventory-dialog">
              {editMode ? 'Edit Inventory Item' : 'Add Inventory Item'}
            </DialogTitle>
            <DialogContent>
              <Box
                component="form"
                onSubmit={(e) =>
                  editMode ? handleUpdate(e, editingRow.id) : handleSubmit(e)
                }
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Inventory Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="type-label">Inventory Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="item_type"
                    label="Inventory Type"
                    value={formData.item_type}
                    onChange={handleChange}
                    required
                  >
                    {inventoryTypes.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  name="quantity"
                  label="Quantity"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.quantity}
                  onChange={handleChange}
                  helperText={
                    formData.item_type === 'seeds' ||
                    formData.item_type === 'feed'
                      ? 'Quantity in kilograms'
                      : 'Quantity'
                  }
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    label="Status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {statusOptions.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  name="last_service_date"
                  label="Last Service Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.last_service_date}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="service_details"
                  label="Service Details"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.service_details}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="next_service_date"
                  label="Next Service Due Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.next_service_date}
                  onChange={handleChange}
                />
                <DialogActions>
                  <Button
                    onClick={editMode ? handleClose : handleClose}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    {editMode ? 'Update' : 'Add'}
                  </Button>
                </DialogActions>
              </Box>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="confirm-dialog-title"
          >
            <DialogTitle id="confirm-dialog-title">
              Confirm Deletion
            </DialogTitle>
            <DialogContent>
              Are you sure you want to delete the selected items?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
              <Button onClick={handleDeleteSelected} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </DefaultLayout>
  );
};
export default InventoryPage;
