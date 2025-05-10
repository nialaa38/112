import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form, Badge, Alert, Spinner, Card, Container, Row, Col } from 'react-bootstrap';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [projectManagers, setProjectManagers] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',
    user_id: '',
    budget: '',
    status: 'To Do',
    start_date: '',
    due_date: '',
    completed_date: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchProjectManagers();
    fetchCurrentUser();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch projects');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/project-managers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project managers');
      }

      const data = await response.json();
      setProjectManagers(data);
    } catch (err) {
      console.error('Error fetching project managers:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }

      const data = await response.json();
      setCurrentUser(data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentProject({
      name: '',
      description: '',
      user_id: '',
      budget: '',
      status: 'To Do',
      start_date: '',
      due_date: '',
      completed_date: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      const today = new Date().toISOString().split('T')[0];
      setCurrentProject({ 
        ...currentProject, 
        [name]: value,
        completed_date: value === 'Completed' ? today : null
      });
    } else if (name === 'start_date') {
      // If start date is after due date, update due date to start date
      if (currentProject.due_date && value > currentProject.due_date) {
        setCurrentProject({ 
          ...currentProject, 
          [name]: value,
          due_date: value 
        });
      } else {
        setCurrentProject({ ...currentProject, [name]: value });
      }
    } else if (name === 'due_date') {
      // If due date is before start date, show error
      if (currentProject.start_date && value < currentProject.start_date) {
        setError('Due date cannot be earlier than start date');
        return;
      }
      setCurrentProject({ ...currentProject, [name]: value });
    } else {
      setCurrentProject({ ...currentProject, [name]: value });
    }
  };

  const handleShowModal = () => {
    setCurrentProject({
      name: '',
      description: '',
      user_id: currentUser ? currentUser.id : '',
      budget: '',
      status: 'To Do',
      start_date: '',
      due_date: '',
      completed_date: ''
    });
    setEditMode(false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const url = editMode
        ? `http://localhost:8000/api/projects/${currentProject.id}`
        : 'http://localhost:8000/api/projects';

      const method = editMode ? 'PUT' : 'POST';

      // Format the project data
      const projectData = {
        name: currentProject.name,
        description: currentProject.description || null,
        user_id: currentUser ? currentUser.id : currentProject.user_id,
        budget: parseFloat(currentProject.budget),
        status: editMode ? currentProject.status : 'To Do',
        start_date: currentProject.start_date,
        due_date: currentProject.due_date,
        completed_date: currentProject.status === 'Completed' ? new Date().toISOString().split('T')[0] : null
      };

      // Log the payload for debugging
      console.log('Sending payload:', projectData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Server error details:', data);
        throw new Error(data.message || 'Failed to save project');
      }

      fetchProjects();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.message);
    }
  };

  const handleEdit = (project) => {
    setCurrentProject({
      id: project.id,
      name: project.name,
      description: project.description,
      user_id: project.user_id,
      budget: project.budget,
      status: project.status,
      start_date: formatDateInput(project.start_date),
      due_date: formatDateInput(project.due_date),
      completed_date: project.completed_date || (project.status === 'Completed' ? new Date().toISOString().split('T')[0] : null)
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (project) => {
    if (!window.confirm('Are you sure you want to cancel this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          user_id: project.user_id,
          budget: project.budget,
          status: 'Cancelled',
          start_date: project.start_date,
          due_date: project.due_date
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel project');
      }

      // Update the project in the local state
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, status: 'Cancelled' } : p
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProjectClick = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      navigate(`/projects/${projectId}`);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-primary';
      case 'In Progress':
        return 'bg-warning';
      case 'Completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const formatDateInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0]; // Returns "YYYY-MM-DD"
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getDueDateStatus = (project) => {
    const daysRemaining = calculateDaysRemaining(project.due_date);
    if (daysRemaining === null) return null;

    if (project.status === 'Completed') {
      const completionDate = project.completed_date || new Date().toISOString().split('T')[0];
      return `Completed on ${formatDate(completionDate)}`;
    }

    if (daysRemaining < 0) {
      return `${Math.abs(daysRemaining)} day(s) overdue`;
    }

    if (daysRemaining === 0) {
      return 'Due today';
    }

    return `${daysRemaining} day(s) remaining`;
  };

  const getDueDateColor = (project) => {
    const daysRemaining = calculateDaysRemaining(project.due_date);
    if (daysRemaining === null) return '';
    if (project.status === 'Completed') {
      if (daysRemaining < 0) {
        return 'text-danger fw-semibold';
      }
      return 'text-success fw-semibold';
    }
    if (daysRemaining < 0) return 'text-danger';
    if (daysRemaining === 0) return 'text-primary';
    if (daysRemaining <= 3) return 'text-warning';
    if (daysRemaining > 3) return 'text-dark';
    return 'text-dark';
  };

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === '' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading projects...</span>
      </div>
    );
  }

  return (
    <Container fluid className="px-4 py-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
          <Row className="align-items-center mb-3">
            <Col>
              <h2 className="mb-0 fw-bold">Projects</h2>
              <p className="text-muted mb-0">Manage and track all your projects</p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                onClick={handleShowModal}
                className="fw-semibold"
              >
                <i className="bi bi-plus-circle me-2"></i>New Project
              </Button>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0 ps-0"
                />
              </div>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-md-end">
              <span className="text-muted">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
              </span>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          {error && (
            <Alert variant="danger" className="m-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          {filteredProjects.length === 0 ? (
            <div className="text-center p-5 bg-light rounded m-3">
              <i className="bi bi-folder text-muted fs-1"></i>
              <p className="mt-3 mb-0">
                {projects.length === 0 
                  ? 'No projects found. Create your first project to get started!' 
                  : 'No projects match your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="ps-4">Name</th>
                    <th>Manager</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Due Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      onClick={() => handleProjectClick(project.id)}
                      style={{ cursor: 'pointer' }}
                      className="hover-highlight"
                    >
                      <td className="ps-4">
                        <div className="fw-semibold">{project.name}</div>
                        {project.description && (
                          <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                            {project.description}
                          </div>
                        )}
                      </td>
                      <td>
                        {project.manager ? (
                          <div className="d-flex align-items-center">
                            {project.manager.name.toUpperCase()}
                          </div>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </td>
                      <td>
                        <Badge className={`${getStatusBadgeClass(project.status)} py-2 px-3 rounded-pill`}>
                          {project.status}
                        </Badge>     
                      </td>
                      <td>
                        <span className="fw-semibold">₱{parseFloat(project.budget).toLocaleString()}</span>
                      </td>
                      <td>
                        <div className={getDueDateColor(project)}>
                          {formatDate(project.due_date)}
                          {calculateDaysRemaining(project.due_date) !== null && (
                            <div className="small">
                              {getDueDateStatus(project)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-end pe-4" onClick={(e) => e.stopPropagation()}>
                        {project.status !== 'Cancelled' && (
                          <>
                            <Button
                              variant="light"
                              size="sm"
                              className="me-2 border"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(project);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="light"
                              size="sm"
                              className="border text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project.id);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Project Form Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {editMode ? 'Edit Project' : 'Create New Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <p className="text-muted mb-4">
            {editMode 
              ? 'Update project details and information' 
              : 'Fill in the details to create a new project'}
          </p>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={currentProject.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter project name"
                    className="form-control-modern"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Project Manager</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_id"
                    value={currentUser ? currentUser.name : ''}
                    readOnly
                    className="form-control-modern bg-light"
                  />
                </Form.Group>
              </div>
              <div className="col-12 mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={currentProject.description}
                    onChange={handleInputChange}
                    placeholder="Provide a brief description of the project"
                    className="form-control-modern"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Budget (₱)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="budget"
                    value={currentProject.budget}
                    onChange={handleInputChange}
                    required
                    placeholder="0.00"
                    className="form-control-modern"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={currentProject.status}
                    onChange={handleInputChange}
                    required
                    className="form-select-modern"
                    disabled={!editMode}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={currentProject.start_date}
                    onChange={handleInputChange}
                    required
                    max={currentProject.due_date || undefined}
                    className="form-control-modern"
                  />
                  {currentProject.due_date && (
                    <Form.Text className="text-muted">
                      Must be before (or on) the due date
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={currentProject.due_date}
                    onChange={handleInputChange}
                    required
                    min={currentProject.start_date || undefined}
                    className="form-control-modern"
                  />
                  {currentProject.start_date && (
                    <Form.Text className="text-muted">
                      Must be on or after the start date
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="light" 
                onClick={handleCloseModal} 
                className="me-2 fw-semibold border"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="fw-semibold px-4"
              >
                {editMode ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Projects;