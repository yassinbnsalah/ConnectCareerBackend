const express = require("express");
const lessonService = require("../services/lessonService");
const router = express.Router();
const bodyParser = require("body-parser");
const admin = require('firebase-admin');
router.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const upload = multer();
const Lesson = require('../models/Lesson'); 



router.post("/addLesson", upload.fields([{ name: 'lessonLogo', maxCount: 1 }]), async (req, res) => {
    try {
      await lessonService.AddLesson(req, res, admin);
      return res.status(200).json({ message: 'Lesson added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get("/allLessons", async (req, res) => {
  try {
    const result = await lessonService.getAllLessons();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const jobs = await lessonService.getLessonByInstructor(userId);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/details/:lessonID", async (req, res) => {
  const lessonID = req.params.lessonID;
  try {
    const lessons = await lessonService.getLessonDetails(lessonID);
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/learningDetails/:lessonID", async (req, res) => {
  const lessonID = req.params.lessonID;
  try {
    const lessons = await lessonService.getLessonToLearn(lessonID);
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/update-lesson/:lessonID', async (req, res) => {
  const lessonID = req.params.lessonID;
  const updatedFields = {
    
    Instructor: req.body.Instructor,
    LessonTitle: req.body.LessonTitle,
    lessonLogo: req.body.lessonLogo,
    lessonDescription: req.body.lessonDescription,
    category: req.body.category,
    CreatedAt: new Date(),
    chapters: JSON.parse(req.body.chapters), 
  };
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
        lessonID,
        updatedFields,
      { new: true }
    );

    res.json({ message: 'Job updated successfully', updatedLesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating job' });
  }
});

router.put("/updateEnroledStudent/:lessonID",
  async (req, res) => {
    try {
      const { lessonID } = req.params;

      const updatedLesson = await lessonService.updateEnroledStudent(
        lessonID
      );

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete("/deleteLesson/:lessonID", async (req, res) => {
  const lessonID = req.params.lessonID;
  try {
    const deletionResult = await lessonService.deleteLesson(lessonID);
    
    if (deletionResult.status === 200) {
      res.status(200).json({ message: "Lesson deleted successfully" });
    } else if (deletionResult.status === 404) {
      res.status(404).json({ message: "Lesson not found" });
    } else {
      res.status(500).json({ error: "Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
