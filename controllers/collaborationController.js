const Collaboration = require('../models/Collaboration');
const User = require('../models/User');
const calculateProgress = require('../utils/calculateProgress');
const mongoose = require('mongoose');


// Создание коллаборации
exports.createCollaboration = async (req, res) => {
  const { title, description } = req.body;
  try {
    const collaboration = new Collaboration({
      title,
      description,
      ownerId: req.user.id,
      participants: [{ userId: req.user.id, role: 'owner', progress: 0 }],
      progress: 0,
    });
    await collaboration.save();
    res.status(201).json(collaboration);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Получение всех коллабораций текущего пользователя
exports.getAllCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find({
      'participants.userId': req.user.id,
    });
    res.json(collaborations);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Получение одной коллаборации по ID
exports.getCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id).populate('participants.userId', 'username email');
    if (!collaboration) return res.status(404).json({ msg: 'Collaboration not found' });
    res.json(collaboration);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Обновление описания (только владелец)
exports.updateDescription = async (req, res) => {
  const { description } = req.body;
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) return res.status(404).json({ msg: 'Collaboration not found' });
    if (collaboration.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only owner can update description' });
    }
    collaboration.description = description;
    await collaboration.save();
    res.json(collaboration);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Удаление коллаборации (только владелец)

exports.deleteCollaboration = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid collaboration ID' });
    }

    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) return res.status(404).json({ msg: 'Collaboration not found' });

    if (!collaboration.ownerId) {
      return res.status(500).json({ msg: 'Collaboration has no ownerId' });
    }

    if (collaboration.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only owner can delete collaboration' });
    }

    await Collaboration.deleteOne({ _id: collaboration._id });
    res.json({ msg: 'Collaboration deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send('Server error');
  }
};

// Пригласить участника (по email, только владелец)
exports.inviteParticipant = async (req, res) => {
  const { email, role } = req.body;
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) return res.status(404).json({ msg: 'Collaboration not found' });
    if (collaboration.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only owner can invite participants' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (collaboration.participants.some(p => p.userId.toString() === user.id)) {
      return res.status(400).json({ msg: 'User already participant' });
    }
    collaboration.participants.push({ userId: user.id, role, progress: 0 });
    collaboration.progress = calculateProgress(collaboration.participants);
    await collaboration.save();
    res.json(collaboration);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Удалить участника (только владелец)
exports.removeParticipant = async (req, res) => {
  const { userId } = req.params;
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) return res.status(404).json({ msg: 'Collaboration not found' });
    if (collaboration.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only owner can remove participants' });
    }
    if (userId === collaboration.ownerId.toString()) {
      return res.status(400).json({ msg: 'Owner cannot be removed' });
    }
    collaboration.participants = collaboration.participants.filter(p => p.userId.toString() !== userId);
    collaboration.progress = calculateProgress(collaboration.participants);
    await collaboration.save();
    res.json(collaboration);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Покинуть коллаборацию (любой участник)
exports.leaveCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) return res.status(404).json({ msg: 'Collaboration not found' });
    if (req.user.id === collaboration.ownerId.toString()) {
      return res.status(400).json({ msg: 'Owner cannot leave collaboration' });
    }
    collaboration.participants = collaboration.participants.filter(p => p.userId.toString() !== req.user.id);
    collaboration.progress = calculateProgress(collaboration.participants);
    await collaboration.save();
    res.json(collaboration);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Обновление прогресса участника
exports.updateProgress = async (req, res) => {
  const { progress } = req.body;
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) return res.status(404).json({ msg: 'Collaboration not found' });
    const participant = collaboration.participants.find(p => p.userId.toString() === req.user.id);
    if (!participant) return res.status(403).json({ msg: 'You are not a participant' });
    participant.progress = progress;
    collaboration.progress = calculateProgress(collaboration.participants);
    await collaboration.save();
    res.json(collaboration);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

