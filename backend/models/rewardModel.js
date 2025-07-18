import mongoose from 'mongoose';

// Schema untuk Reward
const rewardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: Object,
    required: true
  }
});

const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;
