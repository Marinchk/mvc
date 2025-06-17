const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  progress: { type: Number, default: 0 }, // от 0 до 100
});

const CollaborationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  participants: [ParticipantSchema],
  progress: { type: Number, default: 0 },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Collaboration', CollaborationSchema);
