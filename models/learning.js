const mongoose = require("mongoose");
const { Schema } = mongoose;
const LearningSchema = new mongoose.Schema({
    learnerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  },
  LessonTitle: String,
  lessonLogo: String,
  category: String, 
  StartedAt :{
    type: Date,
    default: Date.now // Set default value to current date/time when a new document is created
}, 
  progress: {
    type: [[Number]],
    default: [],
  }
});

const Learning = mongoose.model("Learning", LearningSchema);

module.exports = Learning;