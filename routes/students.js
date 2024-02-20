const express = require('express');
const StudentService = require('../services/studentService');
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
router.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();
const admin = require("firebase-admin");
router.get("/request", async (req, res) => {
    try {
        const students = await StudentService.getRequestListe();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentDetails = await StudentService.getStudentDetails(studentId);

    res.json(studentDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/", async (req, res) => {
    try {
        const students = await StudentService.getListStudents();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/becomeAlumni/:studentId',   
upload.fields([
    { name: "diploma", maxCount: 1 }
  ]),
   async (req, res) => {
    try {
      const { studentId } = req.params;
  
      const updatedStudent = await StudentService.becomeAlumni(studentId, req,res, admin);
  
      res.json(updatedStudent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
module.exports = router;