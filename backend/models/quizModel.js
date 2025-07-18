import mongoose from 'mongoose';

// Schema untuk pertanyaan dalam kuis
const questionSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [
    {
      type: String,
      required: true
    }
  ],
  correctAnswer: {
    type: String,
    required: true
  }
});

// Schema untuk kuis
const quizSchema = mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Topic'
    },
    title: {
      type: String,
      required: true
    },
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
