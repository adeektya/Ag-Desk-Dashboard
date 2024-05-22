import React, { useState, useEffect } from 'react';
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
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useFarm } from '../../contexts/FarmContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SectionPage = () => {
  const { activeFarm } = useFarm();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchSection();
  }, [activeFarm]);

  const fetchSection = async () => {
    if (!activeFarm) {
      console.log('No active farm selected.');
      return;
    }
    try {
      const response = await axios.get(`http://127.0.0.1:8000/section/?farm_id=${activeFarm.id}`);
      setRows(response.data);
    } catch (error) {
      console.error('Failed to fetch Section', error);
    }
  };

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setEditMode(false); 
    formik.resetForm();
  };

  const handleEditOpen = (row) => {
    setEditMode(true);
    setEditingRow(row);
    formik.setValues(row);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/section/${id}/`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Failed to delete section', error);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      console.log('No items selected for deletion.');
      return;
    }

    const deletePromises = selectedRows.map((id) =>
      axios.delete(`http://127.0.0.1:8000/section/${id}/`)
        .then(() => ({ success: true, id }))
        .catch((error) => ({ success: false, id, error: error.message }))
    );

    try {
      const deleteResults = await Promise.all(deletePromises);
      const failedDeletes = deleteResults.filter((result) => !result.success);
      if (failedDeletes.length > 0) {
        console.error('Some items failed to delete:', failedDeletes);
        alert('Failed to delete some items.');
      }

      const deletedIds = deleteResults.filter((result) => result.success).map((result) => result.id);
      setRows(rows.filter((row) => !deletedIds.includes(row.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error processing deletions:', error);
    }
  };

  const handleRequestError = (error) => {
    if (error.response) {
      console.error('Error response:', error.response.data);
      alert(`Request failed with status code: ${error.response.status}\n${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      alert('No response received from the server. Please try again later.');
    } else {
      console.error('Error setting up request:', error.message);
      alert(`Error setting up request: ${error.message}`);
    }
  };

  // Validation schema for form fields using Yup
  const validationSchema = Yup.object({
    section_name: Yup.string().required('Section Name is required'),
    location: Yup.string().required('Location is required'),
    size_acers: Yup.number().required('Size (acres) is required,Size must be a positive number').positive('Size must be a positive number'),
    section_type: Yup.string().required('Section Type is required'),
  });

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      section_name: '',
      location: '',
      size_acers: '',
      section_type: '',
      add_info: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const updatedFormData = { ...values, farm: activeFarm.id };
      if (editMode) {
        try {
          const response = await axios.put(`http://127.0.0.1:8000/section/${editingRow.id}/`, updatedFormData);
          const updatedRows = rows.map((row) => (row.id === editingRow.id ? response.data : row));
          setRows(updatedRows);
          handleClose();
        } catch (error) {
          handleRequestError(error);
        }
      } else {
        try {
          const response = await axios.post('http://127.0.0.1:8000/section/', updatedFormData);
          setRows([...rows, response.data]);
          handleClose();
        } catch (error) {
          handleRequestError(error);
        }
      }
    },
  });

  const columns = [
    { field: 'section_name', headerName: 'Section Name', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'size_acers', headerName: 'Size (acres)', width: 150 },
    { field: 'section_type', headerName: 'Section Type', width: 150 },
    { field: 'add_info', headerName: 'Remark', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const statusOptions = ['crop', 'livestock', 'field', 'barn', 'other'];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Section Management" />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ mb: 2, mr: 1 }}
          >
            Add Section
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
            sx={{ mb: 2 }}
          >
            Delete Selected
          </Button>
          <Paper style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              autoPageSize
              pagination
              paginationMode="client"
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
            onClose={handleClose}
            aria-labelledby="section-dialog"
          >
            <DialogTitle id="section-dialog">
              {editMode ? 'Edit Section' : 'Add Section'}
            </DialogTitle>
            <DialogContent>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
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
                  value={formik.values.section_name}
                  onChange={formik.handleChange}
                  error={formik.touched.section_name && Boolean(formik.errors.section_name)}
                  helperText={formik.touched.section_name && formik.errors.section_name}
                  required
                />
                <TextField
                  margin="dense"
                  name="location"
                  label="Location"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                  required
                />
                <TextField
                  margin="dense"
                  name="size_acers"
                  label="Size (acres)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formik.values.size_acers}
                  onChange={formik.handleChange}
                  error={formik.touched.size_acers && Boolean(formik.errors.size_acers)}
                  helperText={formik.touched.size_acers && formik.errors.size_acers}
                  required
                />
                <FormControl
                  fullWidth
                  margin="dense"
                  error={formik.touched.section_type && Boolean(formik.errors.section_type)}
                >
                  <InputLabel id="type-label" required>Section Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="section_type"
                    label="Section Type"
                    value={formik.values.section_type}
                    onChange={formik.handleChange}
                  >
                    {statusOptions.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.section_type && formik.errors.section_type && (
                    <Box component="div" sx={{ color: 'error.main', mt: 1 }}>
                      {formik.errors.section_type}
                    </Box>
                  )}
                </FormControl>
                <TextField
                  margin="dense"
                  name="add_info"
                  label="Remark"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formik.values.add_info}
                  onChange={formik.handleChange}
                />
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    {editMode ? 'Update' : 'Add'}
                  </Button>
                </DialogActions>
              </Box>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </DefaultLayout>
  );
};

export default SectionPage;
