import mongoose from 'mongoose';

// Skema untuk materi/kelas
const lessonSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String, // Akan menyimpan konten HTML dari TinyMCE
        required: true,
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Topic',
    },
    user: { // Guru yang membuat materi
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
