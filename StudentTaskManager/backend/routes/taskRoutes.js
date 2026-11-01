const express = require("express");
const router = express.Router();

const Task = require("../models/Task");

// ADD TASK
router.post("/", async (req, res) => {
    try {
        const task = await Task.create(req.body);

        res.status(201).json({
            message: "Task added successfully",
            task
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// VIEW ALL TASKS
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;