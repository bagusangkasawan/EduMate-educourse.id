import mongoose from 'mongoose';

// Schema untuk menyimpan reward yang telah diperoleh oleh siswa
const userRewardSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Reward'
    },
    dateEarned: {
      type: Date,
      default: Date.now
    }
  }
);

// Menjamin setiap kombinasi student + reward bersifat unik
userRewardSchema.index({ student: 1, reward: 1 }, { unique: true });

const UserReward = mongoose.model('UserReward', userRewardSchema);

export default UserReward;
