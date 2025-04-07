import React from 'react';
import './layout.css'; // Import the CSS file for styling
import SideBar from '@/app/_components/SideBar';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <SideBar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
