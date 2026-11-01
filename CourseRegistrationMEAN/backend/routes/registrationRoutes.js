const express = require("express");
const router = express.Router();

const Registration = require("../models/Registration");
const Course = require("../models/Course");

// Register student
router.post("/", async (req, res) => {
    try {
        const { studentName, rollNo, email, courseId } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.availableSeats <= 0) {
            return res.status(400).json({
                message: "No seats available"
            });
        }

        const existing = await Registration.findOne({
            rollNo,
            courseId
        });

        if (existing) {
            return res.status(400).json({
                message: "Already registered for this course"
            });
        }

        const registration = await Registration.create({
            studentName,
            rollNo,
            email,
            courseId
        });

        course.availableSeats -= 1;
        await course.save();

        res.status(201).json({
            message: "Registration successful",
            registration
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// View registrations
router.get("/", async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate("courseId");

        res.json(registrations);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Cancel registration
router.delete("/:id", async (req, res) => {
    try {
        const registration =
            await Registration.findByIdAndDelete(req.params.id);

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        await Course.findByIdAndUpdate(
            registration.courseId,
            { $inc: { availableSeats: 1 } }
        );

        res.json({
            message: "Registration cancelled successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;