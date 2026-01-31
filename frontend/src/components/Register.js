import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ setAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) { 
      alert(err.response?.data?.message || "Registration Failed"); 
    } finally { setLoading(false); }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
      <div className="row shadow-lg overflow-hidden bg-white rounded-4" style={{ maxWidth: '900px', width: '100%', minHeight: '600px' }}>
        
        {/* Left Side: Registration Content */}
        <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Create Account</h3>
            <p className="text-muted small">Join our community and start managing your records efficiently.</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="row">
              <div className="col-12 mb-3">
                <label className="form-label small fw-semibold text-secondary">Full Name</label>
                <input type="text" className="form-control border-0 bg-light p-3" placeholder="John Doe" style={{ borderRadius: '10px' }} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <input type="email" className="form-control border-0 bg-light p-3" placeholder="john@example.com" style={{ borderRadius: '10px' }} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="col-12 mb-4">
                <label className="form-label small fw-semibold text-secondary">Password</label>
                <input type="password" className="form-control border-0 bg-light p-3" placeholder="••••••••" style={{ borderRadius: '10px' }} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-lg w-100 mb-4 fw-bold shadow-sm" style={{ borderRadius: '10px', padding: '12px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <div className="d-flex align-items-center mb-4">
            <hr className="flex-grow-1 opacity-25" />
            <span className="mx-3 text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>Quick Register</span>
            <hr className="flex-grow-1 opacity-25" />
          </div>

          <div className="d-flex justify-content-center mb-4">
            <GoogleLogin onSuccess={(res) => console.log(res)} theme="outline" shape="pill" />
          </div>

          <p className="text-center text-muted small mb-0">
            Already have an account? <Link to="/login" className="text-success text-decoration-none fw-bold">Login here</Link>
          </p>
        </div>

        {/* Right Side: Visual Panel */}
        <div className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center bg-success text-white p-5 text-center">
          <h2 className="fw-bold mb-3">Join Us</h2>
          <p className="opacity-75">Access a world-class student management dashboard in just a few clicks.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;