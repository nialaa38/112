import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../componentStyles/Dashboard.css";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);

  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotification = () => setShowNotification(!showNotification);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">Klick Inc.</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
                <li className={location.pathname === "/dashboard" ? "active" : ""}>
                    <Link to="/dashboard">
                        <i className="bi bi-grid"></i><span>Dashboard</span>
                    </Link>
                </li>

                <li className={location.pathname === "/projects" ? "active" : ""}>
                    <Link to="/projects">
                        <i className="bi bi-folder"></i><span>Projects</span>
                    </Link>
                </li>
{/* 
                <li className={location.pathname === "/tasks" ? "active" : ""}>
                    <Link to="#">
                        <i className="bi bi-list-task"></i><span>Tasks</span>
                    </Link>
                </li> */}


                <li className={location.pathname === "/budget" ? "active" : ""}>
                    <Link to="#">
                        <i className="bi bi-cash-stack"></i><span>Budget Tracker</span>
                    </Link>
                </li>

                <li className={location.pathname === "/reports" ? "active" : ""}>
                    <Link to="#">
                        <i className="bi bi-bar-chart"></i><span>Reports</span>
                    </Link>
                </li>
            </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i><span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content with Navbar */}
      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm position-relative">
          <div className="container-fluid">
            <button className="btn btn-icon me-3" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
            <div className="ms-auto position-relative" ref={notificationRef}>
              <button className="btn btn-icon position-relative" onClick={toggleNotification}>
                <i className="bi bi-bell fs-5"></i>
                <span className="notification-badge">3</span>
              </button>
              {showNotification && (
                <div className="notification-popup shadow-sm">
                  <div className="notification-header fw-bold px-3 pt-2">Notifications</div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">You have a new message</li>
                    <li className="list-group-item">Project deadline tomorrow</li>
                    <li className="list-group-item">System update available</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
