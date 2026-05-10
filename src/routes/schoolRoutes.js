const express = require("express");
const router = express.Router();

const { addSchool, listSchools } = require("../controllers/schoolController");
const { addSchoolRules, listSchoolsRules, validate } = require("../middleware/validate");

// POST /addSchool
router.post("/addSchool", addSchoolRules, validate, addSchool);

// GET /listSchools?latitude=28.61&longitude=77.23
router.get("/listSchools", listSchoolsRules, validate, listSchools);

module.exports = router;
