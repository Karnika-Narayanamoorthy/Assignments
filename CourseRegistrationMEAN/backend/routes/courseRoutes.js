const express = require("express");
const router = express.Router();

const Course = require("../models/Course");

// Add course
router.post("/", async (req, res) => {
    try {
        const course = await Course.create(req.body);

        res.status(201).json(course);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();

        res.json(courses);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;