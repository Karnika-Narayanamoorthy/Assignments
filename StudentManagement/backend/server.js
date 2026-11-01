const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Student Schema
const Student = mongoose.model("Student", {
    name: String,
    regNo: String,
    department: String,
    email: String
});

// Add Student
app.post("/students", async (req, res) => {
    const student = await Student.create(req.body);
    res.json(student);
});

// View Students
app.get("/students", async (req, res) => {
    res.json(await Student.find());
});

// Update Student
app.put("/students/:id", async (req, res) => {
    const student = await Student.findByIdAndUpdate(
        req.params.id, req.body, { new: true }
    );
    res.json(student);
});

// Delete Student
app.delete("/students/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});