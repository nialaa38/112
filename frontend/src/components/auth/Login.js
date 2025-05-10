import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import '../../componentStyles/Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const { email, password, remember } = formData;

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // ✅ added this
        },
        body: JSON.stringify({
          email,
          password,
          remember
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid login credentials');
      }

      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-left">
          <div className="login-welcome">
            <h1 className="login-title">Welcome back!</h1>
            <p className="login-subtitle">You can sign in to access with your existing account.</p>
          </div>
          <div className="login-decoration">
            <div className="login-shapes"></div>
          </div>
        </div>

        <div className="login-card-right">
          <div className="login-form-wrapper">
            <h2 className="login-form-heading">Sign In</h2>
            {error && <Alert variant="danger" className="login-alert">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="login-form">
              <Form.Group className="login-form-group">
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="Username or email"
                  className="login-input"
                />
              </Form.Group>

              <Form.Group className="login-form-group">
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="login-input"
                />
              </Form.Group>

              <div className="login-remember-forgot">
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Remember me"
                  name="remember"
                  checked={remember}
                  onChange={handleChange}
                  className="login-checkbox"
                />
                <Link to="/forgot-password" className="login-forgot-link">Forgot password?</Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="login-new-user">
                New here? <Link to="/register" className="login-register-link">Create an account</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
