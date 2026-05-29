const roomService = require('../services/room.service');

const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: 'Invalid room id' });
    }

    const room = await roomService.getRoomById(Number(id));
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const { name, capacity, image_url, is_active } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Room name is required' });
    }

    if (capacity === undefined || capacity === null || Number.isNaN(Number(capacity))) {
      return res.status(400).json({ success: false, message: 'Room capacity is required and must be a number' });
    }

    const room = await roomService.createRoom({
      name: name.trim(),
      capacity: Number(capacity),
      image_url: image_url || null,
      is_active: is_active === undefined ? true : Boolean(is_active),
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
};
