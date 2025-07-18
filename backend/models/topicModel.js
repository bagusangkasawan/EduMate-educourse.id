import mongoose from 'mongoose';

// Schema untuk Topik
const topicSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
