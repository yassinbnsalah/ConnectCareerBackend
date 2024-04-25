const Lesson =require("../models/Lesson");


async function getLessonByInstructor(userId) {
    try {
      const lessons = await Lesson.find({ Instructor: userId });
      if (!lessons) {
        return res.status(404).json({ message: "No lessons found for this Instructor" });
      }
      return lessons;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }

  async function AddLesson(req, res, admin) {
    try {
      const {
        Instructor,
        LessonTitle,
        lessonDescription,
        category,
        Domaine,
        chapters,
      } = req.body;
  
      let lessonLogoURL = "";
      //req.files.lessonLogo
      if (req.body.lessonLogo) {
        const lessonLogoFile = req.files.lessonLogo[0];
        const imageExtension = lessonLogoFile.originalname.split('.').pop();
        const imageName = `${LessonTitle}.${imageExtension}`;
        const lessonLogoBucket = admin.storage().bucket();
        const lessonLogoFileObject = lessonLogoBucket.file(imageName);
        await lessonLogoFileObject.createWriteStream().end(lessonLogoFile.buffer);
        lessonLogoURL = `https://firebasestorage.googleapis.com/v0/b/${lessonLogoBucket.name}/o/${lessonLogoFileObject.name}`;
      }
      const newLesson = new Lesson({
        Instructor,
        LessonTitle,
        lessonLogo : lessonLogoURL,
        lessonDescription,
        category,
        Domaine,
        CreatedAt: new Date(),
        chapters,
      });
      await newLesson.save();
    } catch (error) {
      console.error(error);
    }
  }
  

 
  
  async function getLessonDetails(lessonID) {
    try {
      const lesson = await Lesson.findById(lessonID)
      .populate({
        path: 'Instructor',
        select: 'firstname lastname profileImage'
      });
  
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
  
      return lesson;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }

  async function getLessonToLearn(lessonID) {
    try {
      const lesson = await Lesson.findById(lessonID);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
  
      return lesson;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }


  async function getAllLessons() {
    try {
      const lessons = await Lesson.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'Instructor',
            foreignField: '_id',
            as: 'instructor'
          }
        },
        {
          $project: {
            _id: 1,
            LessonTitle: 1,
            lessonLogo: 1,
            category: 1,
            Domaine: 1,
            rating:1,
            enroledStudent:1,
            CreatedAt:1,
            progress: 1,
            Instructor: 1,
            'instructor.firstname': { $arrayElemAt: ['$instructor.firstname', 0] },
            'instructor.lastname': { $arrayElemAt: ['$instructor.lastname', 0] }
          }
        }
      ]);
  
      return lessons;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
  async function updateEnroledStudent(lessonID) {
    try {
      const lesson = await Lesson.findById(lessonID);
  
      if (!lesson) {
        throw new Error("Lesson not found");
      }
  
      lesson.enroledStudent = lesson.enroledStudent+1;
  
      await lesson.save();
  
     
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async function deleteLesson(lessonID) {
    try {
      const deletedLesson = await Lesson.findById(lessonID);
  
      if (!deletedLesson) {
        throw new Error("Lesson not found");
      }
  
      deletedLesson.isActive = false;
  
      await deletedLesson.save();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  module.exports = {
    getLessonByInstructor,
    getLessonDetails,
    getLessonToLearn,
    AddLesson,
    getAllLessons,
    updateEnroledStudent,
    deleteLesson,
  };
  