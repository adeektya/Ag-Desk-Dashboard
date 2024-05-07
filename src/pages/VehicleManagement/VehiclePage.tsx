import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import "./vehiclepage.css"
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';

interface Vehicle {
  id: number;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  service_status: string;
  next_service_date: string;
  registration_renewal_date: string;
  image: string;
}

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);


  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/vehicle/');
      const data = response.data;
      const sortedData = data.sort((a: Vehicle, b: Vehicle) => a.id - b.id).map((vehicle: Vehicle) => ({
        ...vehicle,
        image: vehicle.image ? `http://127.0.0.1:8000${vehicle.image}/` : null,
      }));
      setVehicles(sortedData);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

 


  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params: GridCellParams) => (
        <Avatar src={params.value as string} alt="Vehicle" />
      ),
    },
    { field: 'vehicle_name', headerName: 'Name', width: 100 },
    { field: 'vehicle_type', headerName: 'Type', width: 110 },
    { field: 'vehicle_make', headerName: 'Make', width: 100 },
    { field: 'vehicle_model', headerName: 'Model', width: 100 },
    { field: 'vehicle_year', headerName: 'Year', width: 100 },
    {
      field: 'service_status',
      headerName: 'Service Status',
      width: 150,
      renderCell: (params) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'Service Due':
              return 'orange';
            case 'Needs Repair':
              return 'red';
            case 'Serviced':
              return 'green';
            default:
              return 'gray';  // Default color if status is unknown
          }
        };
    
        const color = getStatusColor(params.value);
        return (
          <span style={{ color: color, fontWeight: 'bold' }}>
            {params.value}
          </span>
        );
      }
    },
    
    { field: 'next_service_date', headerName: 'Next Service Date', width: 150 },
    { field: 'registration_renewal_date', headerName: 'Registration Renewal Date',
      width: 200,
    },
    {
      
      field: 'actions',
      headerName: 'Actions',
      width: 150,


      renderCell: (params: GridCellParams) => (
        <>
          <IconButton onClick={() => handleEdit(params.row as Vehicle)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row as Vehicle)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),

    },
  ];

  const validationSchema = Yup.object().shape({
    vehicle_name: Yup.string().required('Vehicle Name is required'),
    vehicle_type: Yup.string().required('Vehicle Type is required'),
    vehicle_make:Yup.string().nullable(),
    vehicle_model:Yup.string().nullable(),
    vehicle_year:Yup.number().nullable(),
    service_status: Yup.string().required('Service Status is required'),   
    next_service_date: Yup.date().nullable(),
    registration_renewal_date: Yup.date().nullable(),
    image: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      vehicle_name: '',
      vehicle_type: '',
      vehicle_make: '',
      vehicle_year: null,
      vehicle_model: '',
      service_status: '',
      next_service_date: null,
      registration_renewal_date: null,
      image:null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (editMode) {
        handleUpdate(values);
      } else {
        handleSubmit(values);
      }
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'image' && values[key]) {
        formData.append(key, values[key]);
      } else if (key !== 'image') {
        formData.append(key, values[key]);
      }
    });
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/vehicle/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVehicles(prevVehicles => [...prevVehicles, response.data]);
      handleClose();
      fetchVehicles();

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

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    formik.resetForm();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOpen(true);
    setEditMode(true);
    formik.setValues(vehicle);
  };

  const handleDelete = async (vehicle: Vehicle) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/vehicle/${vehicle.id}/`);
      setVehicles((prevVehicles) =>
        prevVehicles.filter((item) => item.id !== vehicle.id)
      );
    } catch (error) {
      console.error('Failed to delete vehicle', error);
    }
  };
  
  const handleUpdate = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'image') {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        } else if (!values[key]) {
          formData.append(key, new Blob(), ''); // Append an empty file if no file is chosen
        }
      } else {
        formData.append(key, values[key] ? values[key] : '');
      }
    });
  
    try {
      const response = await axios.put(`http://127.0.0.1:8000/vehicle/${selectedVehicle?.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedVehicles = vehicles.map(v => v.id === selectedVehicle?.id ? response.data : v);
      setVehicles(updatedVehicles);
      handleClose();
      fetchVehicles();

    } catch (error) {
      console.error('Failed to update vehicle', error);
      // Optionally handle user feedback here
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
    formik.resetForm();
    
  };

  return (
    <DefaultLayout>
       <Breadcrumb pageName="Vehicle Management" />
    <div>
      <div className="header">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          className="add-button"
        >
          Add Vehicle
        </Button>
      </div>
      <Paper style={{ height: 400, width: '100%' }} className="data-grid-container">
        <DataGrid
        rows={vehicles} 
        columns={columns} 
        autoPageSize
        pagination 
        paginationMode="client" 
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="vehicle_name"
              name="vehicle_name"
              label="Vehicle Name"
              value={formik.values.vehicle_name}
              onChange={formik.handleChange}
              error={
                formik.touched.vehicle_name &&
                Boolean(formik.errors.vehicle_name)
              }
              helperText={
                formik.touched.vehicle_name && formik.errors.vehicle_name
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="vehicle_type"
              name="vehicle_type"
              label="Vehicle Type"
              value={formik.values.vehicle_type}
              onChange={formik.handleChange}
              error={
                formik.touched.vehicle_type &&
                Boolean(formik.errors.vehicle_type)
              }
              helperText={
                formik.touched.vehicle_type && formik.errors.vehicle_type
              }
              margin="normal"
              select
            >
              <MenuItem value="Utility Vehicle">Utility Vehicle</MenuItem>
              <MenuItem value="Tractor">Tractor</MenuItem>
              <MenuItem value="Harvester">Harvester</MenuItem>
              <MenuItem value="Truck">Truck</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              id="vehicle_make"
              name="vehicle_make"
              label="Vehicle Make"
              value={formik.values.vehicle_make}
              onChange={formik.handleChange}
              error={
                formik.touched.vehicle_make &&
                Boolean(formik.errors.vehicle_make)
              }
              helperText={
                formik.touched.vehicle_make && formik.errors.vehicle_make
              }
              margin="normal"
            />
             <TextField
              fullWidth
              id="vehicle_model"
              name="vehicle_model"
              label="Vehicle Model"
              value={formik.values.vehicle_model}
              onChange={formik.handleChange}
              error={
                formik.touched.vehicle_model &&
                Boolean(formik.errors.vehicle_model)
              }
              helperText={
                formik.touched.vehicle_model && formik.errors.vehicle_model
              }
              margin="normal"
            />
             <TextField
              fullWidth
              id="vehicle_year"
              name="vehicle_year"
              label="Vehicle Year"
              type="number"
              value={formik.values.vehicle_year}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />

            <TextField
              fullWidth
              id="service_status"
              name="service_status"
              label="Service Status"
              value={formik.values.service_status}
              onChange={formik.handleChange}
              error={
                formik.touched.service_status &&
                Boolean(formik.errors.service_status)
              }
              helperText={
                formik.touched.service_status && formik.errors.service_status
              }
              margin="normal"
              select
            >
              <MenuItem value="Service Due">Service Due</MenuItem>
              <MenuItem value="Needs Repair">Needs Repair</MenuItem>
              <MenuItem value="Serviced">Serviced</MenuItem>
            </TextField>
            <TextField
              fullWidth
              id="next_service_date"
              name="next_service_date"
              label="Next Service Date"
              type="date"
              value={formik.values.next_service_date || ''}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <TextField
              fullWidth
              id="registration_renewal_date"
              name="registration_renewal_date"
              label="Registration Renewal Date"
              type="date"
              value={formik.values.registration_renewal_date || ''}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <input
              type="file"
              id="image"
              name="image"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                formik.setFieldValue('image', file);
              }}
              className="custom-file-input"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            onClick={() => formik.handleSubmit()}
            color="primary"
            variant="contained"
          >
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </DefaultLayout>
  );
};

export default VehicleManagement;

