import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ user, onLogout, children }) => {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
