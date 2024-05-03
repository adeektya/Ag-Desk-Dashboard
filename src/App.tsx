import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar/Calendar';
import TaskKanban from './pages/Task/TaskKanban';
import InventoryPage from './pages/InventoryPage/InventoryPage';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import EmployeePage from './pages/EmployeePage/EmployeePage';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import VehiclePage from './pages/VehicleManagement/VehiclePage';
import EmployeeRegistration from './pages/Authentication/EmployeeRegistration';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Ag-Desk| Farm management Dashboard" />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/tasks/task-kanban"
          element={
            <>
              <PageTitle title="Task Kanban" />
              <TaskKanban />
            </>
          }
        />
        <Route
          path="/InventoryPage"
          element={
            <>
              <PageTitle title="Inventory Management | Ag-Desk" />
              <InventoryPage />
            </>
          }
        />
        <Route
          path="/EmployeePage"
          element={
            <>
              <PageTitle title="Employee Management | Ag-Desk" />
              <EmployeePage />
            </>
          }
        />
        <Route
          path="/VehiclePage"
          element={
            <>
              <PageTitle title="Vehicle Management | Ag-Desk" />
              <VehiclePage />
            </>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/employee-registration" element={<EmployeeRegistration />} />
      </Routes>
    </>
  );
}

export default App;
