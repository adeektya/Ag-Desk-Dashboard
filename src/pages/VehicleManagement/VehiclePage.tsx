// VehicleManagement.tsx
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridCellParams  } from '@mui/x-data-grid';
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

interface Vehicle {
  id: number;
  vehicle_name: string;
  vehicle_type: string;
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
    // Fetch vehicles from the backend API
    // Replace this with your actual API call
    const fetchVehicles = async () => {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      setVehicles(data);
    };

    fetchVehicles();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params: GridCellParams) => (
        <Avatar src={params.value as string} alt="Vehicle" />
      ),
    },
    { field: 'vehicle_name', headerName: 'Vehicle Name', width: 200 },
    { field: 'vehicle_type', headerName: 'Vehicle Type', width: 150 },
    { field: 'service_status', headerName: 'Service Status', width: 150 },
    { field: 'next_service_date', headerName: 'Next Service Date', width: 200 },
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
    service_status: Yup.string().required('Service Status is required'),
    next_service_date: Yup.date().nullable(),
    registration_renewal_date: Yup.date().nullable(),
    image: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      vehicle_name: '',
      vehicle_type: '',
      service_status: '',
      next_service_date: null,
      registration_renewal_date: null,
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (editMode) {
        // Update vehicle in the backend
        // Replace this with your actual API call
        await fetch(`/api/vehicles/${selectedVehicle?.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.id === selectedVehicle?.id
              ? { ...vehicle, ...values }
              : vehicle
          )
        );
      } else {
        // Create new vehicle in the backend
        // Replace this with your actual API call
        const response = await fetch('/api/vehicles', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        const newVehicle = await response.json();
        setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
      }
      handleClose();
    },
  });

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
    // Delete vehicle from the backend
    // Replace this with your actual API call
    await fetch(`/api/vehicles/${vehicle.id}`, {
      method: 'DELETE',
    });
    setVehicles((prevVehicles) =>
      prevVehicles.filter((v) => v.id !== vehicle.id)
    );
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
    formik.resetForm();
  };

  return (
    <DefaultLayout>
       <Breadcrumb pageName="Vehicle Mangement" />
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
      <div className="data-grid-container">
        <DataGrid rows={vehicles} columns={columns} pagination autoPageSize autoHeight />
      </div>
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
            </TextField>
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
