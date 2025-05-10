import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../componentStyles/LoginStyles.css"; 

const Login = () => {

    // attributes
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // handles the login
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(username, password); 
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), 
            });
    
            const data = await response.json();
            console.log(data); 
    
            if (response.ok) {
                localStorage.setItem('auth_token', data.token);
                navigate("/dashboard");
            } else {
                setError(data.message || "Invalid username or password!");
            }
        } catch (err) {
            setError("An error occurred during login.");
        }
    };
    

    // handles the signup
    const handleSignUp = async (e) => {
        e.preventDefault();
    
        if (!email.includes("@")) {
            setError("Please enter a valid email address!");
            return;
        }
    
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
    
        try {
            console.log(JSON.stringify({ email, username, password })); 
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });
    
            console.log(response); 
    
            const data = await response.json();
    
            console.log(data); 
    
            if (response.ok) {
                localStorage.setItem('auth_token', data.token); 
                setIsSignUp(false);
                setError("");
                alert("Sign-up successful! You can now log in.");
            } else {
                setError(data.message || "Sign-up failed.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred during sign-up.");
        }
    };


    // output display
    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <motion.div
                className={`login-box card shadow-lg ${isSignUp ? "expand" : ""}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="row g-0">
                    {/* Left side: Image */}
                    <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
                        <motion.img
                            src="tasks.png"
                            alt="Login"
                            className="img-fluid login-image"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Right side: Form */}
                    <div className="col-md-6 p-4">
                        <h3 className="text-center mb-3">{isSignUp ? "Sign Up" : "Welcome Back!"}</h3>

                        {error && <motion.div className="alert alert-danger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            {error}
                        </motion.div>}

                        {/* Login Form */}
                        {!isSignUp && (
                            <motion.div className="form-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Login</button>
                                </form>
                            </motion.div>
                        )}

                        {/* Sign-Up Form */}
                        {isSignUp && (
                            <motion.div className="form-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <form onSubmit={handleSignUp}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm Password</label>
                                        <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                                </form>
                            </motion.div>
                        )}


                        <p className="text-center mt-3">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button className="btn btn-link toggle-btn" onClick={() => { setIsSignUp(!isSignUp); setError(""); }}>
                                {isSignUp ? "Login here" : "Sign up"}
                            </button>
                        </p>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
