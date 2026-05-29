````md
# Meeting Room Booking System

An internal meeting room booking web application for employees to easily reserve meeting rooms, check availability, and manage bookings.

## Features

### Employee Features
- View available meeting rooms
- Room cards with image and seating capacity
- Book meeting slots
- View room availability
- Edit / cancel bookings
- Calendar / timeline view
- Optional meeting details (meeting name, department, notes)

### Admin Features
- Add / edit meeting rooms
- Manage room capacity and images
- Enable / disable rooms
- View booking analytics
- Monitor room utilization

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Query

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL client)

---

## Project Structure

```txt
meeting-booking/

├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── .gitignore
└── README.md
````

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/Devanshi1728/meeting-booking.git
cd meeting-booking
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=meeting_booking
```

---

## API Health Check

```http
GET /health
```

Response:

```json
{
  "success": true,
  "message": "Server running"
}
```

---

## Future Enhancements

* Company authentication
* Calendar sync
* Room utilization dashboard
* Meeting reminders
* Mobile WebView support

---

## Status

🚧 Currently in development

```
```
