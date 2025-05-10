// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    projects: { total: 0, active: 0 },
    tasks: { total: 0, completed: 0, overdue: 0 }
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch statistics
      const statsResponse = await fetch('http://localhost:8000/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch recent projects
      const projectsResponse = await fetch('http://localhost:8000/api/projects/recent', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch upcoming tasks
      const tasksResponse = await fetch('http://localhost:8000/api/tasks/upcoming', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const statsData = await statsResponse.json();
      const projectsData = await projectsResponse.json();
      const tasksData = await tasksResponse.json();
      
      setStats(statsData);
      setRecentProjects(projectsData);
      setUpcomingTasks(tasksData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome, {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}!</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Projects</h5>
              <h2>{stats.projects.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Active Projects</h5>
              <h2>{stats.projects.active}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <h2>{stats.tasks.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Overdue Tasks</h5>
              <h2>{stats.tasks.overdue}</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Projects */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Projects</h5>
              <Link to="/projects" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body">
              {recentProjects.length === 0 ? (
                <p className="text-muted">No recent projects found.</p>
              ) : (
                <div className="list-group">
                  {recentProjects.map(project => (
                    <Link 
                      key={project.id} 
                      to={`/projects/${project.id}`} 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">{project.title}</h6>
                        <small className="text-muted">Last updated: {new Date(project.updated_at).toLocaleDateString()}</small>
                      </div>
                      <span className={`badge bg-${project.status === 'completed' ? 'success' : 'primary'} rounded-pill`}>
                        {project.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upcoming Tasks */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Tasks</h5>
              <Link to="/projects" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body">
              {upcomingTasks.length === 0 ? (
                <p className="text-muted">No upcoming tasks found.</p>
              ) : (
                <div className="list-group">
                  {upcomingTasks.map(task => (
                    <Link 
                      key={task.id} 
                      to={`/tasks/${task.id}`} 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">{task.title}</h6>
                        <small className="text-muted">
                          Due: {new Date(task.due_date).toLocaleDateString()} - Project: {task.project_title}
                        </small>
                      </div>
                      <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'} rounded-pill`}>
                        {task.priority}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
