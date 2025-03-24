import React from 'react';

const AdminPage = () => {
  return (
    <div className="min-h-screen">
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9' }}>
        <h2 style={{ color: '#388e3c' }}>Admin Dashboard</h2>
        <section style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#2e7d32' }}>User Management</h3>
          <p style={{ color: '#1b5e20' }}>
            Manage users, roles, and permissions.
          </p>
        </section>
        <section style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#2e7d32' }}>Booking Management</h3>
          <p style={{ color: '#1b5e20' }}>View and manage bookings.</p>
        </section>
        <section style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#2e7d32' }}>Reports</h3>
          <p style={{ color: '#1b5e20' }}>Generate and view reports.</p>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
