import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge, ProgressBar, Alert, Table, Modal } from 'react-bootstrap';
import GanttChart from './ProjectTimeline';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskExpenditures, setTaskExpenditures] = useState([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchProject();
      await fetchStatistics();
      await fetchTaskExpenditures();
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (project && statistics) {
      setStatistics(prevStats => ({
        ...prevStats,
        budget_remaining: (project.budget ?? 0) - (prevStats.total_expenditure ?? 0)
      }));
    }
  }, [project, statistics?.total_expenditure]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${id}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch project statistics');
      }
      
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskExpenditures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/projects/${id}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch task expenditures');
      }
      
      const tasks = await response.json();
      
      let allExpenditures = [];
      for (const task of tasks) {
        const expendituresResponse = await fetch(`http://localhost:8000/api/tasks/${task.id}/expenditures`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const expenditures = await expendituresResponse.json();
        expenditures.forEach(exp => {
          allExpenditures.push({
            expenseDescription: exp.description || 'No description',
            taskName: task.title,
            taskId: task.id,
            amount: exp.amount
          });
        });
      }
      setTaskExpenditures(allExpenditures);
      
      // Update statistics with the new total expenditure
      const totalProjectExpenditure = allExpenditures.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'Completed').length;
      const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      setStatistics(prevStats => ({
        ...prevStats,
        total_expenditure: totalProjectExpenditure,
        completion_percentage: completionPercentage
      }));
      
    } catch (err) {
      console.error('Error fetching task expenditures:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Queue':
        return 'bg-secondary';
      case 'To Do':
        return 'bg-info';
      case 'In Progress':
        return 'bg-primary';
      case 'Completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
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

  const formatCurrency = (amount) => {
    return `₱${parseFloat(amount).toLocaleString()}`;
  };

  if (loading) {
    return <div className="text-center mt-5">Loading project details...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!project) {
    return <Alert variant="warning">Project not found</Alert>;
  }

  return (
    <div className="project-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{project.name}</h2>
        <div>
          {/* Navigates to project's tasks page */}
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate(`/projects/${id}/tasks`)}
          >
            <i className="bi bi-list-task me-1"></i> Tasks
          </Button>

          {/* Opens modal for project timeline */}
          <Button
            variant="outline-danger"
            className="me-2"
            onClick={() => setShowTimelineModal(true)}
          >
            <i className="bi bi-calendar-date me-1"></i> Timeline
          </Button>          
          <Modal show={showTimelineModal} onHide={() => setShowTimelineModal(false)} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Project Timeline</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <GanttChart project={project} />
            </Modal.Body>
          </Modal>
          
          {/* Navigates to projects page */}
          <Button 
            variant="outline-secondary"
            onClick={() => navigate('/projects')}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Projects
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          {/* Project Description */}
          <Row>
            <Col md={8}>
              <h5>Description</h5>
              <p>{project.description || 'No description provided'}</p>
            </Col>
            <Col md={4}>
              <div className="project-meta">
                <p>
                <p>
                  <strong>Project Manager:</strong>{' '}
                  {project.manager ? project.manager.name : 'Unassigned'}
                </p>
                  <strong>Status:</strong>{' '}
                  <Badge className={getStatusBadgeClass(project.status)}>
                    {project.status}
                  </Badge>
                </p>
                <p>
                  <strong>Start Date:</strong> {formatDate(project.start_date)}
                </p>   
                <p>
                  <strong>Due Date:</strong> {formatDate(project.due_date)}
                </p>
                <p>
                  <strong>Budget:</strong> {formatCurrency(project?.budget ?? 0)}
                </p>
              </div>
            </Col>
          </Row>

          {/* Project Progress */}
          <Row>
            <div className="card-body">
              <h6 className="mb-3">Project Completion</h6>
              <ProgressBar 
                now={statistics?.completion_percentage ?? 0}
                label={`${Math.round(statistics?.completion_percentage ?? 0)}%`}
                className="mt-2"
                variant={statistics?.completion_percentage > 90 ? "success" : "primary"} 
              />
            </div>
          </Row>
        </Card.Body>
      </Card>

      {/* Budget Section */}
      <Card className="mt-4">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Budget Overview</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <div className="card bg-light h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Budget</h5>
                  <h2 className="text-primary">{formatCurrency(project?.budget ?? 0)}</h2>
                  <Button variant="outline-primary" className="btn-sm mt-1">
                    <i className="bi bi-pencil-square me-1"></i>
                    Edit
                  </Button>
                </div>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="card bg-light h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">Spent</h5>
                  <h2 className="text-muted">
                    {formatCurrency(statistics?.total_expenditure ?? 0)}
                  </h2>
                  <p className="text-muted mt-3 mb-1">
                    across {taskExpenditures.length} expenditure(s)
                  </p>
                </div>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="card bg-light h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">Remaining</h5>
                  <h2 className={`${statistics?.budget_remaining < 0 ? 'text-danger' : 'text-success'}`}>
                    {formatCurrency(statistics?.budget_remaining ?? project?.budget ?? 0)}
                  </h2>
                  <p className="text-muted mt-3 mb-1">
                      {statistics?.budget_remaining < 0 && (
                        <span className="text-danger">! OVER BUDGET !</span>
                      )}
                      {statistics?.budget_remaining >= 0 && (
                        <span className="text-success">balance is stable</span>
                      )}
                  </p>
                </div>
              </div>
            </Col>
          </Row>          

          {/* Expense History Table */}
          <div className="row"> 
            <div className="col-md-12">
              <div className="card bg-light mb-4">
                <div className="card-body">
                  <h5 className="mb-3">Budget History</h5>
                  <div className="table-responsive">
                    <Table hover className="align-middle table-striped">
                      <thead className="table-secondary">
                        <tr>
                          <th>Expense Description</th>
                          <th>Task Name</th>
                          <th className="text-end ps-0 pe-2">Amount Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taskExpenditures.map((exp, idx) => (
                          <tr key={idx}>
                            <td>{exp.expenseDescription}</td>
                            <td>
                              <Link to={`/tasks/${exp.taskId}`} 
                              className="text-decoration-none">
                                {exp.taskName}
                              </Link>
                            </td>
                            <td className="text-end ps-0 pe-2">{formatCurrency(exp.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-secondary">
                        <tr>
                          <th>Total</th>
                          <th></th>
                          <th className="text-end">
                            {formatCurrency(taskExpenditures.reduce((sum, exp) => sum + parseFloat(exp.amount), 0))}</th>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectDetail;