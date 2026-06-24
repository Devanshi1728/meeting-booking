const express = require('express')
const router = express.Router()
const roomController = require('../controller/room.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

router.post('/rooms', authMiddleware, adminMiddleware, roomController.createRoom)

module.exports = router
