import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// FIXED: Authorization header with Bearer prefix
const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const Dashboard = ({ setAuth }) => {
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const initialForm = {
    firstName: '', lastName: '', email: '', phone: '', address: '', 
    course: '', admissionDate: '', gpa: '', gender: '', emergencyContact: ''
  };
  const [form, setForm] = useState(initialForm);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuth(false);
  }, [setAuth]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students', getConfig());
      setStudents(res.data);
    } catch (err) {
      if(err.response?.status === 401) logout();
    }
  }, [logout]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/students/${currentId}`, form, getConfig());
      } else {
        await axios.post('http://localhost:5000/api/students', form, getConfig());
      }
      setIsEditing(false);
      setCurrentId(null);
      setForm(initialForm);
      fetchStudents();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (student) => {
    setForm(student);
    setIsEditing(true);
    setCurrentId(student._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Permanent delete?")) return;
    await axios.delete(`http://localhost:5000/api/students/${id}`, getConfig());
    fetchStudents();
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 px-4">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-primary">Edu<span className="text-white">Manage</span></span>
          <button onClick={logout} className="btn btn-outline-danger btn-sm rounded-pill px-3">Logout</button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          
          {/* Registration Section */}
          <div className="col-lg-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">{isEditing ? "✏️ Update Student Record" : "➕ Register New Student"}</h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-3"><label className="small fw-bold text-muted">First Name</label><input type="text" className="form-control bg-light border-0" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required /></div>
                    <div className="col-md-3"><label className="small fw-bold text-muted">Last Name</label><input type="text" className="form-control bg-light border-0" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required /></div>
                    <div className="col-md-3"><label className="small fw-bold text-muted">Email</label><input type="email" className="form-control bg-light border-0" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                    <div className="col-md-3"><label className="small fw-bold text-muted">Phone</label><input type="text" className="form-control bg-light border-0" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /></div>
                    
                    <div className="col-md-4"><label className="small fw-bold text-muted">Course</label><input type="text" className="form-control bg-light border-0" value={form.course} onChange={e => setForm({...form, course: e.target.value})} /></div>
                    <div className="col-md-2"><label className="small fw-bold text-muted">GPA</label><input type="number" step="0.01" className="form-control bg-light border-0" value={form.gpa} onChange={e => setForm({...form, gpa: e.target.value})} /></div>
                    <div className="col-md-3"><label className="small fw-bold text-muted">Admission Date</label><input type="date" className="form-control bg-light border-0" value={form.admissionDate ? form.admissionDate.split('T')[0] : ''} onChange={e => setForm({...form, admissionDate: e.target.value})} /></div>
                    <div className="col-md-3"><label className="small fw-bold text-muted">Gender</label>
                      <select className="form-select bg-light border-0" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                        <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="col-md-6"><label className="small fw-bold text-muted">Address</label><input type="text" className="form-control bg-light border-0" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                    <div className="col-md-6"><label className="small fw-bold text-muted">Emergency Contact</label><input type="text" className="form-control bg-light border-0" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} /></div>

                    <div className="col-12 mt-4 pt-2 border-top">
                      <button type="submit" className={`btn px-4 fw-bold ${isEditing ? 'btn-warning' : 'btn-primary'}`}>{isEditing ? "Update Student" : "Register Student"}</button>
                      {isEditing && <button type="button" className="btn btn-light ms-2" onClick={() => {setIsEditing(false); setForm(initialForm);}}>Cancel</button>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Records Table Section */}
          <div className="col-lg-12">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Student Records</h5>
                <span className="badge bg-primary-soft text-primary rounded-pill px-3 py-2" style={{ backgroundColor: '#e7f1ff' }}>{students.length} Total Students</span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr className="text-secondary small text-uppercase">
                      <th className="ps-4">Name</th>
                      <th>Contact & Email</th>
                      <th>Course</th>
                      <th>GPA</th>
                      <th>Admission</th>
                      <th className="pe-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{s.firstName} {s.lastName}</div>
                          <div className="small text-muted">{s.gender}</div>
                        </td>
                        <td>
                          <div className="small fw-semibold">{s.email}</div>
                          <div className="small text-muted">{s.phone}</div>
                        </td>
                        <td><span className="badge bg-light text-dark border-0 px-3 py-2">{s.course}</span></td>
                        <td><span className="fw-bold text-primary">{s.gpa}</span></td>
                        <td className="small text-muted">{s.admissionDate ? new Date(s.admissionDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="pe-4 text-center">
                          <button className="btn btn-sm btn-outline-primary me-2 border-0" onClick={() => handleEdit(s)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(s._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;