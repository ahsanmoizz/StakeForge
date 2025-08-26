import React from 'react';
import { Outlet, Link } from "react-router-dom";
import './Layout.css';

const Layout = () => {
  return (
    <>
      {/* Sidebar Navigation */}
      <div className="sidenav">
        <Link to="/">Home</Link>
        <Link to="contact">Contact</Link>
      
        <Link to="stake">Stake Tokens</Link>
        <Link to="update">Update Platform</Link>
        <Link to="reward">Get Reward</Link>
        <Link to="withdraw">Withdraw</Link>
        <Link to="approve">Approve</Link>
      </div>
      
      {/* Main Content Area */}
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
