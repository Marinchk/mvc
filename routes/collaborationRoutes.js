// const express = require('express');
// const router = express.Router();
// const collaborationController = require('../controllers/collaborationController');
// const authMiddleware = require('../middleware/authMiddleware');

// router.get('/:id/progress', authMiddleware, collaborationController.getProgress);
// router.get('/', authMiddleware, collaborationController.getAllCollaborations);
// router.delete('/:id', authMiddleware, collaborationController.deleteCollaboration);
// router.post('/', authMiddleware, collaborationController.createCollaboration);
// router.get('/:id', authMiddleware, collaborationController.getCollaboration);
// router.post('/:id/invite', authMiddleware, collaborationController.inviteParticipant);
// router.patch('/:id/progress', authMiddleware, collaborationController.updateParticipantProgress);
// router.patch('/:id/description', authMiddleware, collaborationController.updateDescription);
// router.delete('/:id/participants/:userId', authMiddleware, collaborationController.removeParticipant);

// module.exports = router;
const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/new', authMiddleware, collaborationController.showCreateForm);

router.post('/', authMiddleware, collaborationController.createCollaboration);
router.get('/', authMiddleware, collaborationController.getAllCollaborations);
router.get('/:id', authMiddleware, collaborationController.getCollaboration);
router.post('/:id', authMiddleware, collaborationController.updateDescription);
router.delete('/:id', authMiddleware, collaborationController.deleteCollaboration);
router.post('/:id/invite', authMiddleware, collaborationController.inviteParticipant);
router.delete('/:id/members/:userId', authMiddleware, collaborationController.removeParticipant);
router.delete('/:id/leave', authMiddleware, collaborationController.leaveCollaboration);
router.post('/:id/progress', authMiddleware, collaborationController.updateProgress);

module.exports = router;

