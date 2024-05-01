import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import './sidebar.css';

const icons = {
  Dashboard: <DashboardIcon />,
  Calendar: <CalendarTodayIcon />,
  Tasks: <LayersIcon />,
  Inventory: <Inventory2Icon />,
  Employees: <PeopleIcon />,
  Vehicles: <CarRepairIcon />,
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface Farm {
  id: string;
  name: string;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [farms, setFarms] = useState<Farm[]>([
    { id: 'default', name: 'Main Farm' }, // Default farm
  ]);
  const [activeFarm, setActiveFarm] = useState<Farm>(farms[0]);

  const handleAddFarm = () => {
    const farmName = prompt('Please enter the new farm name:');
    if (farmName) {
      const newFarm = { id: Date.now().toString(), name: farmName };
      setFarms([...farms, newFarm]);
    }
  };

  const handleFarmChange = (farmId: string) => {
    const selectedFarm = farms.find((farm) => farm.id === farmId);
    if (selectedFarm) {
      setActiveFarm(selectedFarm);
    }
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };
  const location = useLocation();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
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

  // close if the esc key is pressed
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
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#2a3e52] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
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
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Dropdown for selecting active farm */}
        <select
          className="dark:bg-dark-secondary mx-4 my-4 rounded bg-white p-2"
          onChange={(e) => handleFarmChange(e.target.value)}
          value={activeFarm.id}
        >
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="link-text-menu">MENU</h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <React.Fragment>
                <NavLink to="/" className={getNavLinkClass('/')}>
                  {icons.Dashboard}
                  <span className="link-text">Dashboard</span>
                </NavLink>
              </React.Fragment>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Calendar --> */}
              <li>
                <NavLink
                  to="/calendar"
                  className={getNavLinkClass('/calendar')}
                >
                  {icons.Calendar}
                  <span className="link-text">Calendar</span>
                </NavLink>
              </li>
              {/* <!-- Menu Item Calendar --> */}

              {/* <!-- Menu Item Task --> */}
              <React.Fragment>
                <NavLink
                  to="/tasks/task-kanban" // Adjust this to the actual route
                  className={getNavLinkClass('/tasks')}
                >
                  {icons.Tasks}
                  <span className="link-text">Tasks</span>
                </NavLink>
              </React.Fragment>
              {/* <!-- Menu Item Task --> */}

              {/* <!-- Menu Item Inventory --> */}
              <NavLink
                to="/InventoryPage" // Adjust this to the actual route
                className={getNavLinkClass('/inventory')}
              >
                {icons.Inventory}
                <span className="link-text">Inventory</span>
              </NavLink>
              {/* <!-- Menu Item Inventory --> */}
              <NavLink
                to="/EmployeePage" // Adjust this to the actual route
                className={getNavLinkClass('/employees')}
              >
                {icons.Employees}
                <span className="link-text">Employees</span>
              </NavLink>

              {/* <!-- Menu Item Employee --> */}
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
        {/* <!-- Sidebar Menu --> */}
        {/* Add Farm Button */}
        <div className="mx-4 my-2">
          <button
            className="flex w-full items-center justify-center gap-2 rounded bg-green-500 px-4 py-2 text-white"
            onClick={handleAddFarm}
          >
            <AddCircleOutlineIcon />
            Add Farm
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
