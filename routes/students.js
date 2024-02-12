const express = require('express');
const StudentService = require('../services/studentService');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const students = await StudentService.getListStudents();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;