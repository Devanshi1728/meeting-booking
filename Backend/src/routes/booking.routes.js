const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);

module.exports = router;
