import mongoose from 'mongoose';

// Skema ini sekarang bisa melacak progres untuk Kuis dan Materi
const progressSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // Menandakan jenis progres: 'quiz' atau 'lesson'
    progressType: {
        type: String,
        required: true,
        enum: ['quiz', 'lesson'],
    },
    // ID dari kuis atau materi yang diselesaikan
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Quiz', 'Lesson']
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Topic'
    },
    // Skor hanya relevan untuk kuis
    score: {
        type: Number,
    },
    // Jawaban hanya relevan untuk kuis
    answers: [{
        questionText: String,
        selectedAnswer: String,
        isCorrect: Boolean
    }]
}, {
    timestamps: true
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
