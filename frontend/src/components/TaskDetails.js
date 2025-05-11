import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Badge, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const TaskDetails = () => {
    const { state } = useLocation();
    const task = state?.task;
    const navigate = useNavigate();
    const { taskId } = useParams();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [notifications, setNotifications] = useState([]);

    // Fetch comments for the task
    useEffect(() => {
        const fetchComments = async () => {
            const response = await fetch(`/api/tasks/${taskId}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        };
        fetchComments();
    }, [taskId]);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch('/api/notifications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        };
        fetchNotifications();
    }, []);

    // Handle adding a new comment
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/tasks/${taskId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ comment: newComment }),
        });
        if (response.ok) {
            const comment = await response.json();
            setComments([...comments, comment]);
            setNewComment('');
        }
    };

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
            day: 'numeric',
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
                                <h3 className="mb-0">{task.title || 'Task Details'}</h3>
                                <div>
                                    <Badge bg={getStatusVariant(task.status)} className="p-2 fs-6">
                                        {task.status}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Header>

                        <Card.Body className="p-4">
                            {/* Task Details */}
                            <Row className="mb-4">
                                <Col md={12}>
                                    <div className="task-header mb-4">
                                        <h4>Description</h4>
                                        <div className="p-3 bg-light rounded">
                                            {task.description || 'No description provided'}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Comments Section */}
                            <Row className="mb-4">
                                <Col md={12}>
                                    <h4>Comments</h4>
                                    <div className="p-3 bg-light rounded mb-3">
                                        {comments.length > 0 ? (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="mb-3">
                                                    <strong>{comment.user?.name || 'Anonymous'}</strong>
                                                    <p>{comment.comment}</p>
                                                    <small className="text-muted">
                                                        {new Date(comment.created_at).toLocaleString()}
                                                    </small>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No comments yet.</p>
                                        )}
                                    </div>

                                    {/* Add Comment Form */}
                                    <Form onSubmit={handleCommentSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Add a Comment</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Write your comment here..."
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" variant="primary">
                                            Submit Comment
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>

                            {/* Notifications Section */}
                            <Row className="mb-4">
                                <Col md={12}>
                                    <h4>Notifications</h4>
                                    <div className="p-3 bg-light rounded">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div key={notification.id} className="mb-3">
                                                    <p>{notification.message}</p>
                                                    <small className="text-muted">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </small>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No notifications yet.</p>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
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

export default TaskDetails;