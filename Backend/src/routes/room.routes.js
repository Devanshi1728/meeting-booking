const express = require('express');
const router = express.Router();
const roomController = require('../controller/room.controller');

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);

module.exports = router;
