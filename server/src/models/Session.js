import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  feedback: String,
  whatWasGood: String,
  whatWasMissing: String,
  modelAnswer: String,
});

const sessionSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    topic: { type: String, default: '' },
    questions: [questionSchema],
    overallScore: Number,
    grade: String,
    strengths: [String],
    areasToImprove: [String],
    recommendation: String,
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);
