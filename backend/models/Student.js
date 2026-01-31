const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  course: String,
  admissionDate: Date,
  gpa: Number,
  gender: String,
  emergencyContact: String
});

module.exports = mongoose.model('Student', StudentSchema);