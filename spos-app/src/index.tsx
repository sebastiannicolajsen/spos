import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import AdminPage from './pages/admin/AdminPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MobilePage from './pages/mobile/MobilePage';
import PosPage from './pages/pos/PosPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MobilePage/>
  },
  {
    path: '/dashboard',
    element: <DashboardPage/>
  },
  {
    path: '/pos',
    element: <PosPage/>
  },
  {
    path: '/admin',
    element: <AdminPage/>
  },
  {
    path: '*',
    element: <MobilePage/>
  }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
