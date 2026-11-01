const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true
        },

        rollNo: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Registration",
    registrationSchema
);