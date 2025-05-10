import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import '../../componentStyles/Register.css';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const { name, email, password, password_confirmation } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (password !== password_confirmation) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // ✅ added this
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join('\n'));
        }
        throw new Error(data.message || 'Registration failed');
      }

      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-card-left">
          <div className="register-welcome">
            <h1 className="register-title">Join us today!</h1>
            <p className="register-subtitle">Create a new account to get started with all our features.</p>
          </div>
          <div className="register-decoration">
            <div className="register-shapes"></div>
          </div>
        </div>

        <div className="register-card-right">
          <div className="register-form-wrapper">
            <h2 className="register-form-heading">Create Account</h2>
            {error && <Alert variant="danger" className="register-alert">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="register-form">
              <Form.Group className="register-form-group">
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="register-input"
                />
              </Form.Group>

              <Form.Group className="register-form-group">
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="register-input"
                />
              </Form.Group>

              <Form.Group className="register-form-group">
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  minLength="8"
                  placeholder="Password"
                  className="register-input"
                />
              </Form.Group>

              <Form.Group className="register-form-group">
                <Form.Control
                  type="password"
                  name="password_confirmation"
                  value={password_confirmation}
                  onChange={handleChange}
                  required
                  minLength="8"
                  placeholder="Confirm Password"
                  className="register-input"
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                className="register-submit-btn"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="register-existing-user">
                Already have an account? <Link to="/login" className="register-login-link">Sign In</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
