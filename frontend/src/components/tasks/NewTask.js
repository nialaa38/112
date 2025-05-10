import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const NewTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'To Do',
    priority: 'Medium',
    start_date: '',
    due_date: '',
    estimated_hours: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchProject();
  }, []);

  const fetchProject = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch project');
      const data = await response.json();
      const formattedData = {
        ...data,
        start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
        due_date: data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : ''
      };
      setProject(formattedData);
      setFormData(prev => ({
        ...prev,
        start_date: formattedData.start_date,
        due_date: formattedData.due_date
      }));
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'start_date') {
      if (project && project.start_date && value < project.start_date) {
        alert(`Task start date cannot be earlier than project start date (${formatDate(project.start_date)})`);
        return;
      }
      if (formData.due_date && value > formData.due_date) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          due_date: value 
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'due_date') {
      if (project && project.due_date && value > project.due_date) {
        alert(`Task due date cannot be later than project due date (${formatDate(project.due_date)})`);
        return;
      }
      if (formData.start_date && value < formData.start_date) {
        alert('Due date cannot be earlier than start date');
        return;
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const dataToSend = {
      ...formData,
      project_id: projectId 
    };

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        navigate(`/projects/${projectId}/tasks`);
      } else {
        const errorData = await response.json();
        console.error('Error creating task:', errorData);
        alert(`Failed to create task:\n${JSON.stringify(errorData.errors, null, 2)}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Assigned To</label>
          <select
            name="assigned_to"
            className="form-select"
            value={formData.assigned_to}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value="To Do"
                disabled
              >
                <option value="To Do">To Do</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                value={formData.start_date}
                onChange={handleChange}
                min={project?.start_date}
                max={project?.due_date}
                required
              />
              {project && (
                <small className="text-muted">
                  Project timeline: {new Date(project.start_date).toLocaleDateString()} to {new Date(project.due_date).toLocaleDateString()}
                </small>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                name="due_date"
                className="form-control"
                value={formData.due_date}
                onChange={handleChange}
                min={formData.start_date || project?.start_date}
                max={project?.due_date}
                required
              />
              {project && (
                <small className="text-muted">
                  Project timeline: {new Date(project.start_date).toLocaleDateString()} to {new Date(project.due_date).toLocaleDateString()}
                </small>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Task</button>
      </form>
    </div>
  );
};

export default NewTask;
