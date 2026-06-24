const bookingService = require('../services/booking.service');

const createBooking = async (req, res, next) => {
  try {
    const { room_id, date, start_time, end_time } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!date || Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Valid date is required' });
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!start_time || !timeRegex.test(start_time)) {
      return res.status(400).json({ success: false, message: 'Valid start time is required (HH:MM)' });
    }

    if (!end_time || !timeRegex.test(end_time)) {
      return res.status(400).json({ success: false, message: 'Valid end time is required (HH:MM)' });
    }

    const roomId = Number(room_id);
    if (!room_id || Number.isNaN(roomId) || roomId <= 0) {
      return res.status(400).json({ success: false, message: 'Valid room id is required' });
    }

    const booking = await bookingService.createBooking({
      room_id: roomId,
      user_id: Number(user.id),
      user_name: user.name.trim(),
      department_name: String(user.department || user.department_name || '').trim(),
      date,
      start_time,
      end_time,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }

    if (!date || Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Valid date is required' });
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!start_time || !timeRegex.test(start_time)) {
      return res.status(400).json({ success: false, message: 'Valid start time is required (HH:MM)' });
    }

    if (!end_time || !timeRegex.test(end_time)) {
      return res.status(400).json({ success: false, message: 'Valid end time is required (HH:MM)' });
    }

    const booking = await bookingService.updateBooking(
      Number(id),
      {
        user_name: user.name.trim(),
        department_name: String(user.department || user.department_name || '').trim(),
        date,
        start_time,
        end_time,
      },
      Number(user.id)
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const roomId = req.query.room_id && !Number.isNaN(Number(req.query.room_id)) ? Number(req.query.room_id) : undefined;
    const date = req.query.date ? String(req.query.date) : undefined;
    const bookings = await bookingService.getAllBookings({
      userId: Number(user.id),
      roomId,
      date,
    });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  updateBooking,
};
