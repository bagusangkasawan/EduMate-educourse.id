import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true, 
        enum: ['student', 'parent', 'teacher', 'admin'], 
        default: 'student' 
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'active', 'rejected'],
        default: 'pending',
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    studentCode: { 
        type: String, 
        unique: true, 
        sparse: true 
    },
    children: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { 
    timestamps: true 
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
