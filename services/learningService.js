const Learning = require("../models/learning");

async function CreateNewLearning(req, res) {
  try {
    const { learnerId, courseId, LessonTitle, lessonLogo, category, progress } = req.body;

    const newLearning = new Learning({
      learnerId,
      courseId,
      LessonTitle,
      lessonLogo,
      category,
      StartedAt: new Date(),
      progress,
    });

   await newLearning.save();
   return newLearning;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getLearning(learnerId) {
  try {
    const learnings = await Learning.find({ learnerId: learnerId });
    return learnings;
  } catch (error) {
    console.error("Error fetching learnings by learnerId:", error);
    throw error;
  }
}

async function verifyIfEnroledBefore(learnerId, courseId) {
  try {
    const enroled = await Learning.find({ learnerId: learnerId, courseId: courseId });
    return enroled;
  } catch (error) {
    console.error("Erroo");
    throw error;
  }
}

async function getLearningbyCourseId(courseId) {
  try {
    const learningbyCourseId = await Learning.find({ courseId: courseId }).populate("learnerId");
    return learningbyCourseId;
  } catch (error) {
    console.error("Error");
    throw error;
  }
}
async function getLearningDetails(learningiD) {
  try {
    const learning = await Learning.findById(learningiD).populate(
      "learnerId"
    );
    return learning;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateProgress(learningId, newProgress) {
  try {

    const learning = await Learning.findById(learningId);

    if (!learning) {
      throw new Error("Learning not found");
    }

    learning.progress = newProgress;

    await learning.save();

    return learning;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  CreateNewLearning,
  getLearning,
  verifyIfEnroledBefore,
  getLearningbyCourseId,
  getLearningDetails,
  updateProgress,
};
