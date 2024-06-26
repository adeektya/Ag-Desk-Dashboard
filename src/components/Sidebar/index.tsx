import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import GrassIcon from '@mui/icons-material/Grass';
import BASE_URL from '../../../config'; // Adjust the path as needed

import './sidebar.css';
import axios from 'axios';
import { useFarm } from '../../contexts/FarmContext';
import EditIcon from '@mui/icons-material/Edit';
import FarmFormDialog from './farmform';

const API_URL = `${BASE_URL}/farm/farm/`;
const USER_URL = `${BASE_URL}/user/user-detail/`;

const icons = {
  Dashboard: <DashboardIcon />,
  Calendar: <CalendarTodayIcon />,
  Tasks: <LayersIcon />,
  Inventory: <Inventory2Icon />,
  Employees: <PeopleIcon />,
  Vehicles: <CarRepairIcon />,
  Section: <GrassIcon />,
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface Farm {
  id: string;
  name: string;
  address: string;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { farms, activeFarm, setActiveFarm, updateFarms } = useFarm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('add'); // 'add' or 'edit'
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      try {
        const response = await axios.get(USER_URL, {
          headers: { Authorization: `Token ${token}` },
        });
        setIsOwner(response.data.is_owner);
        console.log('Fetched user details:', response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('Fetched farms:', response.data);
      updateFarms(response.data);
      if (response.data.length > 0) {
        setActiveFarm(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  const handleOpenDialog = (type: string, farm: Farm | null) => {
    setDialogType(type);
    setCurrentFarm(type === 'edit' ? farm : null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentFarm(null);
  };

  const handleFarmSubmit = async (formData: any) => {
    const token = localStorage.getItem('token');
    const url = currentFarm ? `${API_URL}${currentFarm.id}/` : API_URL;
    const method = currentFarm ? 'put' : 'post';

    try {
      const response = await axios[method](url, formData, {
        headers: { Authorization: `Token ${token}` },
      });
      updateFarms(
        currentFarm
          ? farms.map((f) => (f.id === currentFarm.id ? response.data : f))
          : [...farms, response.data]
      );
      setActiveFarm(response.data);
      handleCloseDialog();
      alert(`Farm ${currentFarm ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error(
        `Error ${currentFarm ? 'updating' : 'adding'} farm:`,
        error
      );
      alert(`Failed to ${currentFarm ? 'update' : 'add'} farm.`);
    }
  };

  const handleDeleteFarm = async () => {
    const confirm = window.confirm(
      'Are you sure you want to delete this farm and all associated data?'
    );
    if (!confirm || !currentFarm) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}${currentFarm.id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      updateFarms(farms.filter((f) => f.id !== currentFarm.id));
      setActiveFarm(null);
      handleCloseDialog();
      alert('Farm deleted successfully!');
    } catch (error) {
      console.error('Error deleting farm:', error);
      alert('Failed to delete farm.');
    }
  };

  const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const farmId = e.target.value;
    const selectedFarm = farms.find((farm) => farm.id.toString() === farmId);

    if (selectedFarm) {
      setActiveFarm(selectedFarm);
    } else {
      console.error('Selected farm not found in the list:', farmId);
    }
  };

  const getNavLinkClass = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const location = useLocation();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#2a3e52] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo-link">
          <img
            src="/images/logo/logo-trans.svg"
            alt="Logo"
            className="sidebar-logo-img"
            height={32}
            width={176}
          />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="menu-icon-button"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Dropdown for selecting active farm */}
        <select
          onChange={handleFarmChange}
          value={activeFarm?.id || ''}
          className="dark:bg-dark-secondary mx-4 my-4 rounded bg-white p-2"
        >
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
        {/* Sidebar Menu */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="link-text-menu">MENU</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <React.Fragment>
                <NavLink to="/" className={getNavLinkClass('/')}>
                  {icons.Dashboard}
                  <span className="link-text">Dashboard</span>
                </NavLink>
              </React.Fragment>
              <li>
                <NavLink to="/calendar" className={getNavLinkClass('/calendar')}>
                  {icons.Calendar}
                  <span className="link-text">Calendar</span>
                </NavLink>
              </li>
              <React.Fragment>
                <NavLink
                  to="/tasks/task-kanban"
                  className={getNavLinkClass('/tasks')}
                >
                  {icons.Tasks}
                  <span className="link-text">Tasks</span>
                </NavLink>
              </React.Fragment>
              <NavLink
                to="/SectionPage"
                className={getNavLinkClass('/section')}
              >
                {icons.Section}
                <span className="link-text">Section</span>
              </NavLink>
              <NavLink
                to="/InventoryPage"
                className={getNavLinkClass('/inventory')}
              >
                {icons.Inventory}
                <span className="link-text">Inventory</span>
              </NavLink>
              <NavLink
                to="/EmployeePage"
                className={getNavLinkClass('/employees')}
              >
                {icons.Employees}
                <span className="link-text">Employees</span>
              </NavLink>
              <NavLink
                to="/VehiclePage"
                className={getNavLinkClass('/vehicle')}
              >
                {icons.Vehicles}
                <span className="link-text">Vehicles</span>
              </NavLink>
            </ul>
          </div>
        </nav>
        {/* Add/Edit/Delete Farm Buttons */}
        {isOwner && (
          <div className="mx-4 my-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded bg-green-500 px-4 py-2 text-white"
              onClick={() => handleOpenDialog('add', null)}
            >
              <AddCircleOutlineIcon />
              Add Farm
            </button>
          </div>
        )}
        {isOwner && (
          <div className="mx-4 my-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => handleOpenDialog('edit', activeFarm)}
            >
              <EditIcon />
              Edit Farm
            </button>
          </div>
        )}
        <FarmFormDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          handleSubmit={handleFarmSubmit}
          initialData={currentFarm}
          handleDelete={handleDeleteFarm}
        />
      </div>
    </aside>
  );
};

export default Sidebar;