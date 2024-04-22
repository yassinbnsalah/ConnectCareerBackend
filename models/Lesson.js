const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubChapterSchema = new mongoose.Schema({
    subChapter: String,
    parts: [String]
});

const ChapterSchema = new mongoose.Schema({
    chapter: String,
    subChapters: [SubChapterSchema]
});

const LessonSchema = new mongoose.Schema({
    Instructor: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    LessonTitle: String, 
    lessonLogo: String,
    lessonDescription: String,
    category: String,
    Domaine: String,
    isActive: { type: Boolean, default: true },
    rating:{ type: Number, default: -1 },
    enroledStudent:{ type: Number, default: 0 },
    CreatedAt :{
        type: Date,
        default: Date.now // Set default value to current date/time when a new document is created
    }, 
    chapters: [ChapterSchema]
});

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;