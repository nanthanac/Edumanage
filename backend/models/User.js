const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  name: { type: String },
  picture: { type: String },
  authProvider: { type: String, default: 'local' } // Add this line
});

module.exports = mongoose.model('User', UserSchema);