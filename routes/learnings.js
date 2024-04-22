const express = require("express");
const learningService = require("../services/learningService");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
router.use(bodyParser.urlencoded({ extended: true }));
const Learning = require("../models/learning");

const upload = multer();
router.post(
  "/addLearning",
  async (req, res) => {
    try {
      const learning = await learningService.CreateNewLearning(
        req,
        res
      );
      res.json({ learning: learning });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/getlearning/:userID", async (req, res) => {
  const userId = req.params.userID;
  try {
    const learning = await learningService.getLearning(userId);
    res.json(learning);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/verifyenroled/:userID/:courseId", async (req, res) => {
  const userId = req.params.userID;
  const courseId = req.params.courseId;
  try {
    const learning =
      await learningService.verifyIfEnroledBefore(userId, courseId);
    res.json(learning);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/learninlistebyCourse/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const learnings = await learningService.getLearningbyCourseId(courseId);
    res.json(learnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/learning/:learningID" , async (req,res) =>{
  const learningID = req.params.learningID ; 
  try {
    const learning = await learningService.getLearningDetails(learningID);
    res.json(learning)
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
router.put("/updateProgress/:learningId",
  async (req, res) => {
    try {
      const { learningId } = req.params;
      const { progress } = req.body;

      const updatedLearning = await learningService.updateProgress(
        learningId,
        progress
      );

      res.json({ learning: updatedLearning });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


module.exports = router;
