import mongoose from 'mongoose';

// #region userSchema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,

    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']

    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Viewer', 'Analyst', 'Admin'],
      default: 'Viewer'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;