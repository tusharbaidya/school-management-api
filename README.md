# 🏫 School Management API

A RESTful API built with **Node.js**, **Express.js**, and **MySQL** to manage school data with proximity-based sorting.

---

## 📁 Project Structure

```
school-management/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection pool
│   │   └── setupDatabase.js     # DB & table creation script
│   ├── controllers/
│   │   └── schoolController.js  # Business logic for both endpoints
│   ├── middleware/
│   │   └── validate.js          # Input validation rules
│   ├── routes/
│   │   └── schoolRoutes.js      # Route definitions
│   ├── utils/
│   │   ├── distance.js          # Haversine formula
│   │   └── response.js          # Standardised JSON responses
│   ├── app.js                   # Express app setup
│   └── server.js                # Entry point
├── postman/
│   └── School_Management_API.postman_collection.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm

---

## 🚀 Local Setup

### 1. Clone & install dependencies

```bash
git clone <your-repo-url>
cd school-management
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
```

### 3. Create the database and table

```bash
npm run setup-db
```

This script:
- Creates the `school_management` database (if not exists)
- Creates the `schools` table with proper indexes
- Seeds 5 sample schools in Delhi/Gurugram

### 4. Start the server

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

The server starts at **http://localhost:3000**

---

## 🗄️ Database Schema

```sql
CREATE TABLE schools (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT(10, 6)  NOT NULL,
  longitude   FLOAT(10, 6)  NOT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_name (name),
  INDEX idx_location (latitude, longitude)
);
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3000
```

---

### `POST /addSchool`

Adds a new school to the database.

**Request Body** (JSON):

| Field       | Type   | Required | Constraints                    |
|-------------|--------|----------|--------------------------------|
| `name`      | string | ✅       | 2–255 characters               |
| `address`   | string | ✅       | 5–500 characters               |
| `latitude`  | float  | ✅       | Between -90 and 90             |
| `longitude` | float  | ✅       | Between -180 and 180           |

**Example Request:**
```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi, 110003",
    "latitude": 28.5355,
    "longitude": 77.2410
  }'
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "School added successfully",
  "data": {
    "school": {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi, 110003",
      "latitude": 28.5355,
      "longitude": 77.241,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Validation Error Response (422):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "School name is required" },
    { "field": "latitude", "message": "Latitude must be a number between -90 and 90" }
  ]
}
```

---

### `GET /listSchools`

Returns all schools sorted by proximity to the user's location.

**Query Parameters:**

| Parameter   | Type  | Required | Description              |
|-------------|-------|----------|--------------------------|
| `latitude`  | float | ✅       | User's latitude (-90–90) |
| `longitude` | float | ✅       | User's longitude (-180–180)|

**Example Request:**
```bash
curl "http://localhost:3000/listSchools?latitude=28.4595&longitude=77.0266"
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Schools fetched and sorted by proximity",
  "data": {
    "schools": [
      {
        "id": 2,
        "name": "Ryan International School",
        "address": "Sector 40, Gurugram, Haryana 122003",
        "latitude": 28.4089,
        "longitude": 77.0419,
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z",
        "distance_km": 5.67
      }
    ],
    "total": 5,
    "user_location": {
      "latitude": 28.4595,
      "longitude": 77.0266
    }
  }
}
```

---

## 📐 Distance Calculation

Uses the **Haversine formula** to calculate great-circle distance between two coordinates on Earth:

```
a = sin²(Δlat/2) + cos(lat1) · cos(lat2) · sin²(Δlon/2)
c = 2 · atan2(√a, √(1−a))
d = R · c       (R = 6371 km)
```

Results are in **kilometres**, rounded to 2 decimal places.

---

## 🚢 Deployment

### Option A — Railway (Recommended, Free Tier)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a MySQL plugin
4. Set environment variables from `.env.example`
5. Railway auto-detects `npm start`

### Option B — Render

1. Push to GitHub
2. New Web Service on [render.com](https://render.com)
3. Add a MySQL database (or use PlanetScale)
4. Set environment variables

### Option C — VPS (DigitalOcean / EC2)

```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name school-api

# Save and enable on reboot
pm2 save && pm2 startup
```

---

## 📬 Postman Collection

Import `postman/School_Management_API.postman_collection.json` into Postman.

The collection includes:
- ✅ Health Check
- ✅ Add School (success case)
- ✅ Add School (validation error — missing fields)
- ✅ Add School (validation error — invalid coordinates)
- ✅ List Schools sorted by proximity
- ✅ List Schools (validation error — missing params)

**To change the server URL**: Edit the `base_url` collection variable.

---

## 🛡️ Error Handling

All errors follow a consistent format:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": []  // Optional: field-level validation errors
}
```

| Status Code | Meaning                          |
|-------------|----------------------------------|
| 200         | OK                               |
| 201         | Resource created                 |
| 404         | Route not found                  |
| 422         | Validation failed                |
| 500         | Internal server error            |
