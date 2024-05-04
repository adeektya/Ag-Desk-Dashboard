import DefaultLayout from '../../layout/DefaultLayout';
import { useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  TextField,
  IconButton,
  Avatar,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  useTheme,
  useMediaQuery,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import User17 from '../../images/user/user-17.png';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  API_URL,
} from './api';
import "./employeepage.css"

const EmployeePage = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const formik = useFormik({
    initialValues: {
      image: '',
      name: '',
      role: '',
      section: '',
      contactNumber: '',
      email: '',
      startDate: new Date().toISOString().split('T')[0], // Today's date
      salary: '',
      status: 'Active',
      photo: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Employee name is required'),
      role: yup.string().required('Role is required'),
      section: yup.string().required('Section is required'),
      email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
      startDate: yup.date().required('Start date is required'), // Add validation for start date
    }),
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
          startDate: new Date(values.startDate).toISOString().split('T')[0],
        };

        if (editMode) {
          const updatedEmployee = await updateEmployee(
            currentEmployee.employee_id,
            formData
          );
          const updatedEmployees = employees.map((emp) =>
            emp.id === currentEmployee.id ? updatedEmployee : emp
          );
          setEmployees(updatedEmployees);
        } else {
          const newEmployee = await createEmployee(formData);
          setEmployees([...employees, newEmployee]);
        }

        setOpen(false);
        setError('');
      } catch (e) {
        setError('Failed to perform the operation.');
        setOpenSnackbar(true);
        console.error(e);
      }
    },
  });

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch((e) => {
        setError('Failed to fetch employees.');
        setOpenSnackbar(true);
        console.error(e);
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    formik.resetForm();
    setCurrentEmployee(null);
    setError('');
    setOpenSnackbar(false);
  };

  const handleEditOpen = (employee) => {
    console.log('Editing employee:', employee);
    setEditMode(true);
    setCurrentEmployee(employee);
    formik.setValues({
      ...employee,
      startDate: new Date(employee.start_date).toISOString().split('T')[0],
      photo: '',
    });
    setOpen(true);
  };
  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      setEmployees(employees.filter((emp) => emp.employee_id !== employeeId));
      setError('');
    } catch (e) {
      setError('Failed to delete employee.');
      setOpenSnackbar(true);
      console.error(e);
    }
  };

  const columns = [
    {
      field: 'image',
      headerName: 'Photo',
      renderCell: (params) => (
        <Avatar src={params.value ? `${API_URL}${params.value}` : ''} alt={params.row.name} />
      ),
    },
    {
      field: 'name',
      headerName: 'Employee Name',
      width: 150,
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      editable: true,
    },
    {
      field: 'section',
      headerName: 'Section',
      width: 80,
      editable: true,
    },
    {
      field: 'contactNumber',
      headerName: 'Contact Number',
      width: 130,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true,
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 130,
      editable: true,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      width: 100,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <strong style={{ color: params.value === 'Active' ? 'green' : 'red' }}>
          {params.value}
        </strong>
      ),
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.employee_id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Employee Management" />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
        className="mui-button custom-button" 
      >
        Add Employee
      </Button>
      <div
        style={{ height: 400, width: '100%' }}
        className="data-grid-container"
      >
        <DataGrid
          rows={employees}
          columns={columns}
          autoPageSize
          pagination
          filterMode='server'
          sortingMode='server'
          checkboxSelection
          getRowId={(row) => row.employee_id}
        />
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{editMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <form id="employee-form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Assume that each TextField takes up 6 grid columns */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Employee Name"
                  name="name"
                  autoComplete="name"
                  {...formik.getFieldProps('name')}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  margin="normal"
                  fullWidth
                  id="role"
                  label="Role"
                  name="role"
                  {...formik.getFieldProps('role')}
                >
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  margin="normal"
                  fullWidth
                  id="section"
                  label="Section"
                  name="section"
                  {...formik.getFieldProps('section')}
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  autoComplete="tel"
                  {...formik.getFieldProps('contactNumber')}
                  error={
                    formik.touched.contactNumber &&
                    Boolean(formik.errors.contactNumber)
                  }
                  helperText={
                    formik.touched.contactNumber && formik.errors.contactNumber
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              {/* Start Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="startDate"
                  label="Start Date"
                  name="startDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...formik.getFieldProps('startDate')}
                />
              </Grid>
              {/* Salary */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="salary"
                  label="Salary"
                  name="salary"
                  {...formik.getFieldProps('salary')}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="status"
                  label="Status"
                  name="status"
                  select
                  {...formik.getFieldProps('status')}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
              {/* Optionally, if you're handling file uploads */}
              <Grid item xs={12} sm={6}>
                <input
                  id="file"
                  name="photo"
                  type="file"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      formik.setFieldValue(
                        'photo',
                        event.currentTarget.files[0]
                      );
                    }
                  }}
                />
                {formik.errors.photo && formik.touched.photo && (
                  <p>{formik.errors.photo}</p>
                )}
              </Grid>

              {/* Add more fields here */}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="employee-form" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </DefaultLayout>
  );
};

export default EmployeePage;