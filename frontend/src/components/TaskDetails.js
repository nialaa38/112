import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Badge, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const TaskDetails = () => {
    const { state } = useLocation();
    const task = state?.task;
    const navigate = useNavigate();
    const { taskId } = useParams();

    // Debug the task object to see its structure
    console.log("Task object:", task);

    if (!task) {
        navigate('/projects'); 
        return null;
    }

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency function
    const formatCurrency = (amount) => {
        if (!amount) return '₱0';
        return '₱' + parseFloat(amount).toLocaleString();
    };

    return (
        <div className="container mt-4 mb-5">
            <Row className="justify-content-center">
                <Col lg={10} md={12}>
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-primary text-white p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <Button 
                                    variant="outline-light" 
                                    onClick={() => navigate(-1)}
                                    className="me-2"
                                >
                                    <i className="bi bi-arrow-left me-2"></i>Back
                                </Button>
                                <h3 className="mb-0">{task.title || "Task Details"}</h3>
                                <div>
                                    <Badge 
                                        bg={getStatusVariant(task.status)} 
                                        className="p-2 fs-6"
                                    >
                                        {task.status}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Header>
                        
                        <Card.Body className="p-4">
                            <Row className="mb-4">
                                <Col md={12}>
                                    <div className="task-header mb-4">
                                        <h4>Description</h4>
                                        <div className="p-3 bg-light rounded">
                                            {task.description || "No description provided"}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row className="mb-4">
                                <Col md={6} className="mb-3 mb-md-0">
                                    <Card className="h-100 border-0 shadow-sm">
                                        <Card.Header className="bg-light">
                                            <h5 className="mb-0">Assignment Details</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="icon-box me-3 bg-primary text-white rounded p-2">
                                                    <i className="bi bi-person-fill"></i>
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block">Assigned To</small>
                                                    <strong>{task.assigned_to || "Not assigned"}</strong>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="icon-box me-3 bg-primary text-white rounded p-2">
                                                    <i className="bi bi-flag-fill"></i>
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block">Priority</small>
                                                    <Badge 
                                                        bg={getPriorityVariant(task.priority)} 
                                                        className="mt-1"
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex align-items-center">
                                                <div className="icon-box me-3 bg-primary text-white rounded p-2">
                                                    <i className="bi bi-calendar-event-fill"></i>
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block">Due Date</small>
                                                    <strong>{formatDate(task.due_date)}</strong>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                                <Col md={6}>
                                    <Card className="h-100 border-0 shadow-sm">
                                        <Card.Header className="bg-light">
                                            <h5 className="mb-0">Budget & Status</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="d-flex align-items-center mb-4">
                                                <div className="icon-box me-3 bg-success text-white rounded p-2">
                                                    <i className="bi bi-currency-dollar"></i>
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block">Task Budget</small>
                                                    <h4 className="mb-0">{formatCurrency(task.task_budget)}</h4>
                                                </div>
                                            </div>
                                            
                                            <div className="progress-info">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span>Task Status</span>
                                                    <span>{task.status}</span>
                                                </div>
                                                <div className="progress mb-3" style={{ height: "10px" }}>
                                                    <div 
                                                        className={`progress-bar bg-${getStatusVariant(task.status)}`} 
                                                        role="progressbar" 
                                                        style={{ width: getStatusProgress(task.status) }} 
                                                        aria-valuenow={getStatusProgressValue(task.status)} 
                                                        aria-valuemin="0" 
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Helper function to determine priority badge variant
const getPriorityVariant = (priority) => {
    switch (priority) {
        case 'Low':
            return 'success';
        case 'Medium':
            return 'warning';
        case 'High':
            return 'danger';
        default:
            return 'secondary';
    }
};

// Helper function to determine status badge variant
const getStatusVariant = (status) => {
    switch (status) {
        case 'To Do':
            return 'secondary';
        case 'In Progress':
            return 'primary';
        case 'Done':
            return 'success';
        case 'Under Review':
            return 'info';
        default:
            return 'secondary';
    }
};

// Helper function to get progress bar percentage based on status
const getStatusProgress = (status) => {
    switch (status) {
        case 'To Do':
            return '10%';
        case 'In Progress':
            return '50%';
        case 'Under Review':
            return '75%';
        case 'Done':
            return '100%';
        default:
            return '0%';
    }
};

// Helper function to get progress value for aria attribute
const getStatusProgressValue = (status) => {
    switch (status) {
        case 'To Do':
            return 10;
        case 'In Progress':
            return 50;
        case 'Under Review':
            return 75;
        case 'Done':
            return 100;
        default:
            return 0;
    }
};

export default TaskDetails;