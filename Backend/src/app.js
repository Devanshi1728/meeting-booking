const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");
const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const departmentRoutes = require("./routes/department.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

app.use("/rooms", roomRoutes);
app.use("/booking", bookingRoutes);
app.use("/departments", departmentRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;