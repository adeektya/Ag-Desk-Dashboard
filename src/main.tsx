import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'nouislider/dist/nouislider.css';
import 'dropzone/dist/dropzone.css';
import { AuthProvider } from './contexts/AuthContext';
import { FarmProvider } from "./contexts/FarmContext";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
    <AuthProvider>
    <FarmProvider>
      <App />
    </FarmProvider>
    </AuthProvider>
    </Router>
  </React.StrictMode>
);
