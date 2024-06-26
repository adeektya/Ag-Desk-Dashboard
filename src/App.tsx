import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar/Calendar';
import TaskKanban from './pages/Task/TaskKanban';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import SectionPage from './pages/SectionPage/SectionPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import LandingPage from './pages/LandingPage/LandingPage';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import EmployeePage from './pages/EmployeePage/EmployeePage';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import VehiclePage from './pages/VehicleManagement/VehiclePage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Redirect to sign-in if not authenticated */}
      <Route index element={isAuthenticated ? <Dashboard /> : <LandingPage />} />
      <Route index element={isAuthenticated ? <Dashboard /> : <Navigate replace to="/signin" />} />
      <Route path="/SectionPage" element={isAuthenticated ? <SectionPage/> : <Navigate replace to="/signin" />} />
      <Route path="/calendar" element={isAuthenticated ? <Calendar /> : <Navigate replace to="/signin" />} />
      <Route path="/tasks/task-kanban" element={isAuthenticated ? <TaskKanban /> : <Navigate replace to="/signin" />} />
      <Route path="/InventoryPage" element={isAuthenticated ? <InventoryPage /> : <Navigate replace to="/signin" />} />
      <Route path="/EmployeePage" element={isAuthenticated ? <EmployeePage /> : <Navigate replace to="/signin" />} />
      <Route path="/VehiclePage" element={isAuthenticated ? <VehiclePage /> : <Navigate replace to="/signin" />} />
      <Route path="/Profile" element={isAuthenticated ? <ProfilePage /> : <Navigate replace to="/signin" />} />
    
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <LandingPage />} />
      {/* Unprotected routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
