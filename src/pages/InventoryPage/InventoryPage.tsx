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
import './inventorypage.css';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useFarm } from '../../contexts/FarmContext';

interface InventoryItem {
  id: number;
  name: string;
  item_type: string;
  quantity: number;
  status: string;
  last_service_date: string | null;
  next_service_date: string | null;
  image_repair: string | null;
  repair_description: string;
  section_name: string;
  farm: string;
}

interface SectionItem {
  id: number;
  section_name: string;
}

const InventoryManagement: React.FC = () => {
  const { activeFarm } = useFarm();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (activeFarm) {
      fetchSections();
    }
  }, [activeFarm]);

  useEffect(() => {
    if (activeFarm && sections.length > 0) {
      fetchInventoryItems();
    }
  }, [activeFarm, sections]);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/inventory/?farm_id=${activeFarm.id}`);
      const data = response.data;
      const updatedData = data.map((item: InventoryItem) => {
        const section = sections.find(sec => sec.id === Number(item.section_name));
        return {
          ...item,
          section_name: section ? section.section_name : 'Unknown',
        };
      });
      setInventoryItems(updatedData.sort((a: InventoryItem, b: InventoryItem) => a.id - b.id));
    } catch (error) {
      console.error('Failed to fetch inventory items:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/section/');
      setSections(response.data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };

  const [showRepairDialog, setShowRepairDialog] = useState(false);
  const [selectedRepairInventoryItem, setSelectedRepairInventoryItem] = useState<InventoryItem | null>(null);

  const handleOpenRepairDialog = (item: InventoryItem) => {
    const fullImageRepairUrl = item.image_repair
      ? `http://127.0.0.1:8000${item.image_repair}`
      : null;
    setSelectedRepairInventoryItem({ ...item, image_repair: fullImageRepairUrl });
    setShowRepairDialog(true);
  };

  const handleCloseRepairDialog = () => {
    setShowRepairDialog(false);
    setSelectedRepairInventoryItem(null);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'item_type', headerName: 'Type', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'service due':
              return 'orange';
            case 'needs repair':
              return 'red';
            case 'operational':
              return 'green';
            default:
              return 'gray';
          }
        };

        const color = getStatusColor(params.value);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: color, fontWeight: 'bold' }}>{params.value}</span>
            {params.value === 'needs repair' && (
              <IconButton onClick={() => handleOpenRepairDialog(params.row as InventoryItem)}>
                <SearchIcon />
              </IconButton>
            )}
          </div>
        );
      },
    },
    { field: 'last_service_date', headerName: 'Last Service Date', width: 150 },
    { field: 'next_service_date', headerName: 'Next Service Date', width: 150 },
    { field: 'section_name', headerName: 'Section', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <>
          <IconButton onClick={() => handleEdit(params.row as InventoryItem)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row as InventoryItem)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    item_type: Yup.string().required('Type is required'),
    quantity: Yup.number().required('Quantity is required').positive().integer(),
    status: Yup.string().required('Status is required'),
    last_service_date: Yup.date().nullable(),
    next_service_date: Yup.date().nullable(),
    section_name: Yup.string().required('Section is required'),
    image_repair: Yup.mixed().nullable(),
    repair_description: Yup.string().nullable(),
  });

  const [status, setStatus] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      name: '',
      item_type: '',
      quantity: 0,
      status: '',
      last_service_date: null,
      next_service_date: null,
      section_name: '',
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

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);
    setStatus(event.target.value);
  };

  const handleSubmit = async (values) => {
    if (!activeFarm) return;

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'image_repair') {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        }
      } else if (values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    formData.append('farm', activeFarm.id.toString());

    try {
      const response = await axios.post('http://127.0.0.1:8000/inventory/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setInventoryItems(prevItems => [...prevItems, response.data]);
      handleClose();
      fetchInventoryItems();
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      alert('Failed to add inventory item.');
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    formik.resetForm();
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedInventoryItem(item);
    setOpen(true);
    setEditMode(true);
    formik.setValues({
      ...item,
      image_repair: null,
    });
    setStatus(item.status);
  };

  const handleDelete = async (item: InventoryItem) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/inventory/${item.id}/`);
      setInventoryItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
    }
  };

  const handleUpdate = async (values) => {
    if (!activeFarm) return;

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'image_repair') {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        }
      } else if (values[key] !== null) {
        formData.append(key, values[key]);
      }
    });
    formData.append('farm', activeFarm.id.toString());

    try {
      await axios.put(`http://127.0.0.1:8000/inventory/${selectedInventoryItem?.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleClose();
      fetchInventoryItems();
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      alert('Failed to update inventory item.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInventoryItem(null);
    setStatus('');
    formik.resetForm();
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Inventory Management" />
      <div>
        <div className="header">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            className="add-button"
          >
            Add Inventory Item
          </Button>
        </div>
        <Paper style={{ height: 400, width: '100%' }} className="data-grid-container">
          <DataGrid
            rows={inventoryItems}
            columns={columns}
            autoPageSize
            pagination
            paginationMode="client"
          />
        </Paper>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{editMode ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
              />
              <TextField
                fullWidth
                id="item_type"
                name="item_type"
                label="Type"
                value={formik.values.item_type}
                onChange={formik.handleChange}
                error={formik.touched.item_type && Boolean(formik.errors.item_type)}
                helperText={formik.touched.item_type && formik.errors.item_type}
                margin="normal"
                select
              >
                <MenuItem value="seeds">Seeds</MenuItem>
                <MenuItem value="fertilizers">Fertilizers</MenuItem>
                <MenuItem value="feed">Feed</MenuItem>
                <MenuItem value="tools">Tools</MenuItem>
                <MenuItem value="machinery">Machinery</MenuItem>
                <MenuItem value="vehicles">Vehicles</MenuItem>
              </TextField>
              <TextField
                fullWidth
                id="quantity"
                name="quantity"
                label="Quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                margin="normal"
              />
              <TextField
                fullWidth
                id="status"
                name="status"
                label="Status"
                value={formik.values.status}
                onChange={handleStatusChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                margin="normal"
                select
              >
                <MenuItem value="operational">Operational</MenuItem>
                <MenuItem value="needs repair">Needs Repair</MenuItem>
                <MenuItem value="service due">Service Due</MenuItem>
              </TextField>

              {status === 'needs repair' && (
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
                id="last_service_date"
                name="last_service_date"
                label="Last Service Date"
                type="date"
                value={formik.values.last_service_date || ''}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
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
                id="section_name"
                name="section_name"
                label="Section"
                value={formik.values.section_name}
                onChange={formik.handleChange}
                error={formik.touched.section_name && Boolean(formik.errors.section_name)}
                helperText={formik.touched.section_name && formik.errors.section_name}
                margin="normal"
                select
              >
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.section_name}>
                    {section.section_name}
                  </MenuItem>
                ))}
              </TextField>
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
            {selectedRepairInventoryItem && (
              <>
                {selectedRepairInventoryItem.image_repair && (
                  <Box
                    component="img"
                    src={selectedRepairInventoryItem.image_repair as string}
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
                <p>{selectedRepairInventoryItem.repair_description}</p>
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

export default InventoryManagement;





