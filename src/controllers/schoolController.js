const { pool } = require("../config/database");
const { haversineDistance } = require("../utils/distance");
const { sendSuccess, sendError } = require("../utils/response");

// ── POST /addSchool ───────────────────────────────────────────────────────────

const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );

    const [rows] = await pool.execute("SELECT * FROM schools WHERE id = ?", [result.insertId]);

    return sendSuccess(
      res,
      { school: rows[0] },
      "School added successfully",
      201
    );
  } catch (error) {
    console.error("[addSchool] Error:", error);
    return sendError(res, "Failed to add school. Please try again.", 500);
  }
};

// ── GET /listSchools ──────────────────────────────────────────────────────────

const listSchools = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    const [schools] = await pool.execute("SELECT * FROM schools");

    if (schools.length === 0) {
      return sendSuccess(res, { schools: [], total: 0 }, "No schools found");
    }

    // Attach distance from user's location to every school, then sort ascending
    const schoolsWithDistance = schools
      .map((school) => ({
        ...school,
        distance_km: haversineDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return sendSuccess(
      res,
      {
        schools: schoolsWithDistance,
        total: schoolsWithDistance.length,
        user_location: { latitude: userLat, longitude: userLon },
      },
      "Schools fetched and sorted by proximity"
    );
  } catch (error) {
    console.error("[listSchools] Error:", error);
    return sendError(res, "Failed to fetch schools. Please try again.", 500);
  }
};

module.exports = { addSchool, listSchools };
