// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Order of imports is important - Bootstrap first, then custom styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
// No global import of auth.css here - we import in each component

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/layout/Navbar';
import Projects from './components/projects/Projects';
import ProjectDetail from './components/projects/ProjectDetail';
import Tasks from './components/tasks/Tasks';
import TaskDetail from './components/tasks/TaskDetail';
import NewTask from './components/tasks/NewTask'; 
import Budget from './components/budget/Budget';
import Notifications from './components/Notifications';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    checkUserAuthentication();
    
    // Listen for sidebar toggle events
    const handleSidebarToggle = (e) => {
      setSidebarCollapsed(e.detail);
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const checkUserAuthentication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <h1>Task Management System</h1>
        {isAuthenticated && <Navbar user={user} onLogout={logout} />}
        
        <Routes>
          {/* Auth routes outside the main container */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={login} />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register onLogin={login} />
          } />
          
          {/* Protected routes with layout */}
          <Route path="/" element={
            isAuthenticated ? (
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Dashboard user={user} />
              </main>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Dashboard user={user} />
              </main>
            </PrivateRoute>
          } />
          
          <Route path="/projects" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Projects />
              </main>
            </PrivateRoute>
          } />
          
          <Route path="/projects/:id" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <ProjectDetail />
              </main>
            </PrivateRoute>
          } />
          
          <Route path="/projects/:projectId/tasks" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Tasks />
              </main>
            </PrivateRoute>
          } />
          
          <Route path="/projects/:projectId/tasks/new" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <NewTask />
              </main>
            </PrivateRoute>
          } />
          
          <Route path="/tasks/:id" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <TaskDetail />
              </main>
            </PrivateRoute>
          } />
          
          <Route path="/projects/:id/budget" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <main className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Budget />
              </main>
            </PrivateRoute>
          } />

          {/* Route for Notifications */}
          <Route path="/notifications" element={<Notifications />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
