const express = require("express");
const TeacherService = require("../services/teacherService");
const router = express.Router();
router.get("/ListTeachers", async (req, res) => {
    try {
      const teachers = await TeacherService.getListTeachers();
      res.json(teachers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  module.exports = router;