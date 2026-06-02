const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const departmentRoutes = require("./routes/department.routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

app.use("/rooms", roomRoutes);
app.use("/booking", bookingRoutes);
app.use("/departments", departmentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;