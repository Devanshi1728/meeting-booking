const bookingService = require('../services/booking.service');

const createBooking = async (req, res, next) => {
  try {
    const { room_id, department_name, date, start_time, end_time } = req.body;

    if (!department_name || typeof department_name !== 'string') {
      return res.status(400).json({ success: false, message: 'Department name is required' });
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
      department_name: department_name.trim(),
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
    const { department_name, date, start_time, end_time } = req.body;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }

    if (!department_name || typeof department_name !== 'string') {
      return res.status(400).json({ success: false, message: 'Department name is required' });
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

    const booking = await bookingService.updateBooking(Number(id), {
      department_name: department_name.trim(),
      date,
      start_time,
      end_time,
    });

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
    const bookings = await bookingService.getAllBookings();
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
