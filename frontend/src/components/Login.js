import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleGoogle = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { 
        token: credentialResponse.credential 
      });
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="row shadow-lg overflow-hidden bg-white rounded-4" style={{ maxWidth: '900px', width: '100%', minHeight: '550px' }}>
        
        {/* Left Side: Branding/Visual */}
        <div className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center bg-primary text-white p-5">
          <h2 className="fw-bold mb-3">EduManage</h2>
          <p className="text-center opacity-75">Streamlining student administration with precision and ease.</p>
          <div className="mt-4 border border-white border-opacity-25 rounded-circle p-4">
             <i className="bi bi-mortarboard fs-1"></i>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
            <p className="text-muted small">Please enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg border-0 bg-light fs-6" 
                placeholder="name@university.com"
                style={{ borderRadius: '10px' }}
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg border-0 bg-light fs-6" 
                placeholder="••••••••"
                style={{ borderRadius: '10px' }}
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 mb-4 fw-bold shadow-sm"
              disabled={loading}
              style={{ borderRadius: '10px', padding: '12px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="d-flex align-items-center mb-4">
            <hr className="flex-grow-1 text-muted opacity-25" />
            <span className="mx-3 text-muted small text-uppercase fw-bold" style={{ letterSpacing: '1px', fontSize: '10px' }}>Secure Social Login</span>
            <hr className="flex-grow-1 text-muted opacity-25" />
          </div>

          <div className="d-flex justify-content-center mb-4">
            <GoogleLogin 
              onSuccess={handleGoogle} 
              onError={() => console.log('Failed')} 
              theme="outline"
              shape="pill"
              width="100%"
            />
          </div>

          <p className="text-center text-muted small mb-0">
            Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;