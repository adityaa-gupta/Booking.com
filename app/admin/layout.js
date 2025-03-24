import React from 'react';
import SideBar from '../_components/SideBar';
import './layout.css'; // Import the CSS file for styling

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <SideBar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
