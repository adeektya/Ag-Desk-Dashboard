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
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './vehiclepage.css';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useFarm } from '../../contexts/FarmContext';
import BASE_URL from '../../../config';  // Adjust the path as needed

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
  farm: string;
  image_repair: string;
  repair_description: string;
}

const VehicleManagement: React.FC = () => {
  const { activeFarm } = useFarm();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (activeFarm) {
      fetchVehicles();
    }
  }, [activeFarm]);

  const fetchVehicles = async () => {
    try {
      if (activeFarm) {
        const response = await axios.get(`${BASE_URL}/vehicle/?farm_id=${activeFarm.id}`);
        const data = response.data;
        const sortedData = data
          .sort((a: Vehicle, b: Vehicle) => a.id - b.id)
          .map((vehicle: Vehicle) => ({
            ...vehicle,
            image: vehicle.image ? `${BASE_URL}${vehicle.image}/` : null,
          }));
        setVehicles(sortedData);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const [showRepairDialog, setShowRepairDialog] = useState(false);
  const [selectedRepairVehicle, setSelectedRepairVehicle] = useState<Vehicle | null>(null);

  const handleOpenRepairDialog = (vehicle: Vehicle) => {
    const fullImageRepairUrl = vehicle.image_repair
      ? `${BASE_URL}${vehicle.image_repair}`
      : null;
    setSelectedRepairVehicle({ ...vehicle, image_repair: fullImageRepairUrl });
    setShowRepairDialog(true);
  };

  const handleCloseRepairDialog = () => {
    setShowRepairDialog(false);
    setSelectedRepairVehicle(null);
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
              return 'gray';
          }
        };

        const color = getStatusColor(params.value);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: color, fontWeight: 'bold' }}>{params.value}</span>
            {params.value === 'Needs Repair' && (
              <IconButton onClick={() => handleOpenRepairDialog(params.row as Vehicle)}>
                <SearchIcon />
              </IconButton>
            )}
          </div>
        );
      },
    },
    { field: 'next_service_date', headerName: 'Next Service Date', width: 150 },
    {
      field: 'registration_renewal_date',
      headerName: 'Registration Renewal Date',
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
    vehicle_make: Yup.string().nullable(),
    vehicle_model: Yup.string().nullable(),
    vehicle_year: Yup.number()
      .required('Vehicle Year is required')
      .min(0, 'Year must be at least 0')
      .max(new Date().getFullYear(), `Year can't be in the future`),
    service_status: Yup.string().required('Service Status is required'),
    next_service_date: Yup.date().nullable(),
    registration_renewal_date: Yup.date().nullable(),
    image: Yup.mixed().nullable(),
    image_repair: Yup.mixed().nullable(),
    repair_description: Yup.string().nullable(),
  });
  

  const [serviceStatus, setServiceStatus] = useState<string>('');

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
      image: null,
      image_repair: null,
      repair_description: '',
      farm: activeFarm ? activeFarm.id : '',
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

  const handleServiceStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);
    setServiceStatus(event.target.value);
  };

  const handleSubmit = async (values) => {
    if (!activeFarm) return;

    const formData = new FormData();


    // Append form values to formData
    Object.keys(values).forEach(key => {
      if (key === 'image' || key === 'image_repair') {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        }
      } else if (values[key] !== null){
        formData.append(key, values[key]);
      }
    });
  
    // Append the activeFarm.id to formData
    formData.append('farm', activeFarm.id.toString());
  
    try {
      const response = await axios.post(`${BASE_URL}/vehicle/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVehicles(prevVehicles => [...prevVehicles, response.data]);
      handleClose();
      fetchVehicles();
    } catch (error) {
  
      if (error.response) {
        console.error('Request failed with status code:', error.response.status);
        console.error('Error response:', error.response.data);
        alert(`Request failed with status code: ${error.response.status}\n${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response received from the server. Please try again later.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Error setting up request: ${error.message}`);
      }
  
      if (error.response && error.response.data && typeof error.response.data === 'object') {
        const fieldErrors = Object.entries(error.response.data as Record<string, { string: string }[]>).map(
          ([field, errors]) => {
            return `${field}: ${errors.map((error) => error.string).join(', ')}`;
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
    formik.setValues({
      ...vehicle,
      image: null,
      image_repair: null,
    });
    setServiceStatus(vehicle.service_status);
  };
  
  const handleDelete = async (vehicle: Vehicle) => {
    try {
      await axios.delete(`${BASE_URL}/vehicle/${vehicle.id}/`);
      setVehicles((prevVehicles) =>
        prevVehicles.filter((item) => item.id !== vehicle.id)
      );
    } catch (error) {
      console.error('Failed to delete vehicle', error);
    }
  };

  const handleUpdate = async (values) => {
    if (!activeFarm) return;

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if ((key === 'image' || key === 'image_repair') && values[key]) {
        formData.append(key, values[key]);
      } else if (values[key] !== null) {
        formData.append(key, values[key]);
      }
    });
    formData.append('farm', activeFarm.id.toString());

    try {
      await axios.put(`${BASE_URL}/vehicle/${selectedVehicle?.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleClose();
      fetchVehicles();
    } catch (error) {
      if (error.response) {
        console.error('Request failed with status code:', error.response.status);
        console.error('Error response:', error.response.data);
        alert(`Request failed with status code: ${error.response.status}\n${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response received from the server. Please try again later.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Error setting up request: ${error.message}`);
      }
  
      if (error.response && error.response.data && typeof error.response.data === 'object') {
        const fieldErrors = Object.entries(error.response.data as Record<string, { string: string }[]>).map(
          ([field, errors]) => {
            return `${field}: ${errors.map((error) => error.string).join(', ')}`;
          }
        );
        alert(`Field errors:\n${fieldErrors.join('\n')}`);
      }
    }
  };
  

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
    setServiceStatus('');
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
                error={formik.touched.vehicle_name && Boolean(formik.errors.vehicle_name)}
                helperText={formik.touched.vehicle_name && formik.errors.vehicle_name}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                id="vehicle_type"
                name="vehicle_type"
                label="Vehicle Type"
                value={formik.values.vehicle_type}
                onChange={formik.handleChange}
                error={formik.touched.vehicle_type && Boolean(formik.errors.vehicle_type)}
                helperText={formik.touched.vehicle_type && formik.errors.vehicle_type}
                margin="normal"
                select
                required
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
                error={formik.touched.vehicle_make && Boolean(formik.errors.vehicle_make)}
                helperText={formik.touched.vehicle_make && formik.errors.vehicle_make}
                margin="normal"
              />
              <TextField
                fullWidth
                id="vehicle_model"
                name="vehicle_model"
                label="Vehicle Model"
                value={formik.values.vehicle_model}
                onChange={formik.handleChange}
                error={formik.touched.vehicle_model && Boolean(formik.errors.vehicle_model)}
                helperText={formik.touched.vehicle_model && formik.errors.vehicle_model}
                margin="normal"
              />
          
              <TextField
              fullWidth
              id="vehicle_year"
              name="vehicle_year"
              label="Vehicle Year"
              type="number"
              value={formik.values.vehicle_year || ''}
              onChange={formik.handleChange}
              error={formik.touched.vehicle_year && Boolean(formik.errors.vehicle_year)}
              helperText={formik.touched.vehicle_year && typeof formik.errors.vehicle_year === 'string' ? formik.errors.vehicle_year : ''}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              required
            />
            
              <TextField
                fullWidth
                id="service_status"
                name="service_status"
                label="Service Status"
                value={formik.values.service_status}
                onChange={handleServiceStatusChange}
                error={formik.touched.service_status && Boolean(formik.errors.service_status)}
                helperText={formik.touched.service_status && formik.errors.service_status}
                margin="normal"
                select
                required
              >
                <MenuItem value="Service Due">Service Due</MenuItem>
                <MenuItem value="Needs Repair">Needs Repair</MenuItem>
                <MenuItem value="Serviced">Serviced</MenuItem>
              </TextField>

              {serviceStatus === 'Needs Repair' && (
                <>
                  <input
                    type="file"
                    id="image_repair"
                    name="image_repair"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      formik.setFieldValue('image_repair', file);
                    }}
                    className="custom-file-input"
                  />
                  <TextField
                    fullWidth
                    id="repair_description"
                    name="repair_description"
                    label="Repair Description"
                    value={formik.values.repair_description}
                    onChange={formik.handleChange}
                    margin="normal"
                  />
                </>
              )}
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
        <Dialog open={showRepairDialog} onClose={handleCloseRepairDialog} maxWidth="md" fullWidth>
          <DialogTitle>Repair Details</DialogTitle>
          <DialogContent>
            {selectedRepairVehicle && (
              <>
                {selectedRepairVehicle.image_repair && (
                  <Box
                    component="img"
                    src={selectedRepairVehicle.image_repair as string}
                    alt="Repair"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                )}
                <br />
                <h1 style={{ fontSize: '1.25rem' }}>Description</h1>
                <br />
                <p>{selectedRepairVehicle.repair_description}</p>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRepairDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </DefaultLayout>
  );
};

export default VehicleManagement;



