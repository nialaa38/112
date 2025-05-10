import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../componentStyles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: !sidebarCollapsed }));
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header p-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-kanban-fill text-primary me-3"></i>
            {!sidebarCollapsed && <span className="sidebar-brand">Klick Inc.</span>}
          </div>
        </div>
        <ul className="nav flex-column sidebar-nav px-0">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard">
              <i className="bi bi-speedometer2 me-3"></i>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/projects') ? 'active' : ''}`} to="/projects">
              <i className="bi bi-kanban me-3"></i>
              {!sidebarCollapsed && <span>Projects</span>}
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link className={`nav-link ${isActive('/tasks') ? 'active' : ''}`} to="/tasks">
              <i className="bi bi-check2-square me-3"></i>
              {!sidebarCollapsed && <span>Tasks</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/budget') ? 'active' : ''}`} to="/budget">
              <i className="bi bi-wallet2 me-3"></i>
              {!sidebarCollapsed && <span>Budget</span>}
            </Link>
          </li> */}
        </ul>
        <div className="sidebar-footer p-3">
          <button onClick={onLogout} className="btn btn-link logout-btn p-2">
            <i className="bi bi-box-arrow-right"></i>
            {!sidebarCollapsed && <span className="ms-3">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Top Navbar */}
      <nav className={`top-navbar ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="container-fluid px-4 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {/* Burger Menu Toggle Button */}
              <button className="btn btn-link p-1" onClick={toggleSidebar}>
                <i className="bi bi-list fs-4"></i>
              </button>
              <div className="page-title px-3">
                {location.pathname === '/dashboard' && <h5 className="mb-0">Dashboard</h5>}
                {location.pathname.startsWith('/projects') && <h5 className="mb-0">Projects</h5>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              {/* Notification Bell */}
              <div className="dropdown me-3">
                <button className="btn btn-link notification-btn p-2" type="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-bell fs-4"></i>
                  {/* <span className="notification-badge bg-danger">3</span> */}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                  <li className="dropdown-header">Notifications</li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li><a className="dropdown-item px-3 py-2" href="#">New task assigned to you</a></li>
                  <li><a className="dropdown-item px-3 py-2" href="#">Project deadline approaching</a></li>
                  <li><a className="dropdown-item px-3 py-2" href="#">Budget alert: 80% reached</a></li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li><a className="dropdown-item px-3 py-2 text-center text-muted" href="#">See all notifications</a></li>
                </ul>
              </div>
              {/* User Avatar & Name*/}
              <div className="dropdown">
                <button className="btn btn-link dropdown-toggle d-flex align-items-center user-dropdown p-2 text-decoration-none" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    <span className="fw-medium text-dark">{user?.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><a className="dropdown-item px-3 py-2" href="#"><i className="bi bi-person me-2"></i>Profile</a></li>
                  <li><a className="dropdown-item px-3 py-2" href="#"><i className="bi bi-gear me-2"></i>Settings</a></li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li><button className="dropdown-item px-3 py-2" onClick={onLogout}><i className="bi bi-box-arrow-right me-2"></i>Sign out</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;