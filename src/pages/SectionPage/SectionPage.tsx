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

const SectionPage = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    section_name: '',
    location: '',
    size_acers: '',
    section_type: '',
    add_info: '',

  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/section/');
      setRows(response.data);
    } catch (error) {
      console.error('Failed to fetch Section', error);
    }
  };

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setEditMode(false); 
    setFormData({ 
    section_name: '',
    location: '',
    size_acers: '',
    section_type: '',
    add_info: '',
  });
    
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Check if the field is a date field and if the value is empty

    setFormData({
      ...formData,
      [name]: value, // Update the specific field based on input
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {

      // Submit the data
      const response = await axios.post(
        'http://127.0.0.1:8000/section/',
        formData
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
        const fieldErrors = Object.entries(error.response.data as Record<string, { string: string }[]>).map(
          ([field, errors]) => {
            return `${field}: ${errors
              .map((error) => error.string)
              .join(', ')}`;
          }
        );
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
          `http://127.0.0.1:8000/section/${id}/`,
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
      await axios.delete(`http://127.0.0.1:8000/section/${id}/`);
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
        .delete(`http://127.0.0.1:8000/section/${id}/`)
        .then(() => ({ success: true, id }))
        .catch((error) => ({
          success: false,
          id,
          error: error.message || 'Failed to delete item',
        }))
    );

    const optionPromises = selectedRows.map((id) =>
      axios
        .options(`http://127.0.0.1:8000/section/${id}/`)
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
    handleCloseConfirmDialog();

  };

  // Optional: Confirmation dialog state
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);



  const statusOptions = ['crop', 'livestock', 'field','barn','other'];

  const columns = [
    { field: 'section_name', headerName: 'Section Name', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'size_acers', headerName: 'Size (acre)', width: 150 },
    { field: 'section_type', headerName: 'Section Type', width: 150 },
    { field: 'add_info', headerName: 'Remark', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
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
      <Breadcrumb pageName="Section Management" />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ mb: 2, mr: 1 }} // Added right margin
          >
            Add Section
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
            aria-labelledby="section-dialog"
            className="dialog-content"
          >
            <DialogTitle id="section-dialog">
              {editMode ? 'Edit Section' : 'Add Section'}
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
                  name="section_name"
                  label="Section Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.section_name}
                  onChange={handleChange}
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  name="location"
                  label="Location"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  name="size_acers"
                  label="Size"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.size_acers}
                  onChange={handleChange}
                  required
                />                
                <FormControl fullWidth margin="dense">
                  <InputLabel id="type-label">Section Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="section_type"
                    label="Section Type"
                    value={formData.section_type}
                    onChange={handleChange}
                    required
                  >
                    {statusOptions.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  autoFocus
                  margin="dense"
                  name="add_info"
                  label="Remark"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.add_info}
                  onChange={handleChange}
                  required
                />  
      
                <DialogActions>
                  <Button
                    onClick={handleClose}
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
export default SectionPage;
