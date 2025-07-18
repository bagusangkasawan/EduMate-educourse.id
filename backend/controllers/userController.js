import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const generateStudentCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
    if (userExists) {
        res.status(400);
        throw new Error('Email atau username sudah digunakan');
    }

    const userData = { name, username, email, password, role };

    // Siswa langsung aktif, yang lain butuh persetujuan
    if (role === 'student') {
        userData.status = 'active';
        let code;
        do {
            code = generateStudentCode();
        } while (await User.findOne({ studentCode: code }));
        userData.studentCode = code;
    } else {
        userData.status = 'pending';
    }

    const user = await User.create(userData);

    if (user) {
        // Hanya berikan token jika statusnya aktif (untuk siswa)
        if (user.status === 'active') {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(201).json({ message: `Pendaftaran sebagai ${role} berhasil. Akun Anda menunggu persetujuan.` });
        }
    } else {
        res.status(400);
        throw new Error('Data pengguna tidak valid');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { login, password } = req.body;
    const user = await User.findOne({ $or: [{ email: login.toLowerCase() }, { username: login.toLowerCase() }] }).populate('children', 'name email');

    if (user && (await user.matchPassword(password))) {
        // Cek status akun sebelum login
        if (user.status === 'pending') {
            res.status(401);
            throw new Error('Akun Anda belum disetujui oleh administrator.');
        }
        if (user.status === 'rejected') {
            res.status(401);
            throw new Error('Pendaftaran akun Anda telah ditolak, silakan hubungi administrator.');
        }
        // Jika status 'active'
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            children: user.children,
            studentCode: user.studentCode,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Kredensial tidak valid');
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password').populate('children', '_id name email');
    if (user) res.json(user);
    else { res.status(404); throw new Error('User not found'); }
});

const linkStudent = asyncHandler(async (req, res) => {
    const { studentCode } = req.body;
    const parent = await User.findById(req.user._id);
    const student = await User.findOne({ studentCode });
    if (!student) { res.status(404); throw new Error('Student with this code not found.'); }
    if (parent.children.includes(student._id)) { res.status(400); throw new Error('Student already linked.'); }
    parent.children.push(student._id);
    await parent.save();
    const updatedParent = await User.findById(req.user._id).populate('children', '_id name email');
    res.json(updatedParent);
});

export { registerUser, loginUser, getUserProfile, linkStudent };
