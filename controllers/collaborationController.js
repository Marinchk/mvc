const Collaboration = require('../models/Collaboration');
const User = require('../models/User');
const calculateProgress = require('../utils/calculateProgress');
const mongoose = require('mongoose');


exports.showCreateForm = (req, res) => {
  res.render('create-collaboration', { error: null });
};

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

  
    res.redirect('/api/collaborations');
  } catch (err) {
    console.error(err);
    res.status(500).render('create-collaboration', { error: 'Error when creating' });
  }
};


exports.getAllCollaborations = async (req, res) => {
  try {
    
    const ownedCollaborations = await Collaboration.find({
      ownerId: req.user.id,
    });

    const memberCollaborations = await Collaboration.find({
      'participants.userId': req.user.id,
      ownerId: { $ne: req.user.id },  
    });

    
    res.render('dashboard', {
      user: req.user,
      ownedCollaborations,
      memberCollaborations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.getCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('participants.userId', 'username email')
      .populate('ownerId', 'username email'); 

    if (!collaboration) {
      return res.status(404).send('Collaboration not found');
    }

    res.render('collaboration', { collaboration });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateDescription = async (req, res) => {
  const { description } = req.body;
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('participants.userId', 'username email')
      .populate('ownerId', 'username email');

    if (!collaboration) return res.status(404).send('Collaboration not found');

    if (collaboration.ownerId._id.toString() !== req.user.id) {
      return res.status(403).send('Only owner can update description');
    }

    collaboration.description = description;
    await collaboration.save();

    res.render('collaboration', { collaboration, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


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


exports.inviteParticipant = async (req, res) => {
  const { email, role } = req.body;
  const collaborationId = req.params.id;

  try {
    const collaboration = await Collaboration.findById(collaborationId)
      .populate('participants.userId', 'username email')
      .populate('ownerId', 'username email');

    if (!collaboration) {
      return res.status(404).render('error', { message: 'Collaboration not found' });
    }

    if (collaboration.ownerId._id.toString() !== req.user.id) {
      return res.status(403).render('error', { message: 'Only the owner can invite participants.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('collaboration', {
        collaboration,
        user: req.user,
        error: 'The user with this email was not found.',
      });
    }

    if (collaboration.participants.some(p => p.userId.toString() === user.id)) {
      return res.render('collaboration', {
        collaboration,
        user: req.user,
        error: 'The user is already participating in the collaboration',
      });
    }

    collaboration.participants.push({ userId: user.id, role, progress: 0 });
    collaboration.progress = calculateProgress(collaboration.participants);
    await collaboration.save();

    res.redirect(`/api/collaborations/${collaborationId}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error' });
  }
};

exports.removeParticipant = async (req, res) => {
  const { userId } = req.params;
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('ownerId', 'username')
      .populate('participants.userId', 'username');

    if (!collaboration) return res.status(404).send('Collaboration not found');
    if (collaboration.ownerId._id.toString() !== req.user.id) {
      return res.status(403).send('Only owner can remove participants');
    }
    if (userId === collaboration.ownerId._id.toString()) {
      return res.status(400).send('Owner cannot be removed');
    }

    collaboration.participants = collaboration.participants.filter(p => p.userId._id.toString() !== userId);
    collaboration.progress = calculateProgress(collaboration.participants);
    await collaboration.save();

    const updatedCollab = await Collaboration.findById(req.params.id)
      .populate('ownerId', 'username')
      .populate('participants.userId', 'username');

    res.render('collaboration', { collaboration: updatedCollab });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};



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


exports.updateProgress = async (req, res) => {
  const { progress, userId } = req.body; 
  const collabId = req.params.id;
  const currentUserId = req.user.id; 

  try {
    const collaboration = await Collaboration.findById(collabId).populate('ownerId').populate('participants.userId');
    if (!collaboration) return res.status(404).send('Collaboration not found');

    const isOwner = collaboration.ownerId._id.toString() === currentUserId;

    const participantToUpdate = collaboration.participants.find(p => p.userId._id.toString() === userId);
    if (!participantToUpdate) return res.status(404).send('Participant not found');

    if (!isOwner && userId !== currentUserId) {
      return res.status(403).send('You are not allowed to update this participant\'s progress');
    }
    participantToUpdate.progress = Number(progress);
    collaboration.progress = calculateProgress(collaboration.participants);
    await collaboration.save();
    res.render('collaboration', { collaboration });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
