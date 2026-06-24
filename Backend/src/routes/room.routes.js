const express = require('express');
const router = express.Router();
const roomController = require('../controller/room.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', authMiddleware, adminMiddleware, roomController.createRoom);

module.exports = router;
