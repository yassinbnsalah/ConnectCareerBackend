const express = require('express');
const jobService = require('../services/jobService');
const admin = require('firebase-admin');

const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
const multer = require('multer');
const Job = require('../models/job');
const Skills = require('../models/skills');

const upload = multer();
router.post('/add',   upload.fields([{ name: 'jobFile', maxCount: 1 }]), async (req, res) => {
  try {
    const jobs = await jobService.AddJob(req, res,admin);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/all', async (req, res) => {
  try {
    const result = await jobService.getAllJob();
    if (result.status === 404) {
      return res.status(404).json({ message: result.message });
    } if (result.status === 500) {
      return res.status(500).json({ error: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const jobs = await jobService.getJobByRecruiter(userId, res);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/entreprise/:entrepriseId/jobs', async (req, res) => {
  const { entrepriseId } = req.params;
  const result = await jobService.getJobsByEntrepriseId(entrepriseId);

  if (result.status === 404) {
    return res.status(404).json({ message: result.message });
  } if (result.status === 500) {
    return res.status(500).json({ message: result.message });
  }
  res.status(200).json(result.data);
});

router.get('/details/:jobID', async (req, res) => {
  const { jobID } = req.params;
  try {
    const data = await jobService.getJobDetails(jobID);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/detailstoupdate/:jobID', async (req, res) => {
  const { jobID } = req.params;
  try {
    const data = await jobService.getJobUpdateDetails(jobID);
    console.log('***********entreprise**************');
    console.log(data.entreprise);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update-job/:jobID', async (req, res) => {
  const { jobID } = req.params;
  const updatedFields = {

    jobTitle: req.body.jobTitle,
    location: req.body.location,
    typeofworkplace: req.body.typeofworkplace,
    jobType: req.body.jobType,
    salary: req.body.salary,
    description: req.body.description,
    termsAndConditions: req.body.termsAndConditions,
    isActive: req.body.isActive,
    creationDate: new Date(),
    duration: req.body.duration,
    yearOfExperience: req.body.yearOfExperience,
    cible: req.body.cible,
    closeDate: req.body.closeDate,

  };
  try {
    console.log('skills ');
    console.log(JSON.parse(req.body.skillers));
    const JobToUpdate = await Job.findById(jobID);
    const skillsJob = [];
    const SKillTab = JSON.parse(req.body.skillers);
    for (const element of SKillTab) {
      try {
        let skill = await Skills.findOne({ skillname: element });

        if (!skill) {
          skill = new Skills({ skillname: element });
          await skill.save();
        }

        skillsJob.push(skill._id);
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
    JobToUpdate.skills = skillsJob;
    await JobToUpdate.save();
    const updatedJob = await Job.findByIdAndUpdate(
      jobID,
      updatedFields,
      { new: true },
    );

    res.json({ message: 'Job updated successfully', updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating job' });
  }
});

router.put('/disabled/:jobID', async (req, res) => {
  const { jobID } = req.params;
  console.log(`Updating Job${jobID}`);
  try {
    const JobToUpdate = await Job.findById(jobID);

    JobToUpdate.isActive = false;
    await JobToUpdate.save();
    res.json({ message: 'Job updated successfully', JobToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating job' });
  }
});
router.post('/add-pdf', upload.fields([{ name: 'jobFile', maxCount: 1 }, { name: 'jobTitle' }]), async (req, res) => {
  try {
      const jobTitle = req.body.jobTitle;
      const jobFile = req.files.jobFile[0];

      const newJob = new Job({
          jobTitle: jobTitle,
          jobFile: jobFile, 
      });

      await newJob.save();

      res.json({ message: 'Job and PDF uploaded successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error uploading job and PDF' });
  }
});

module.exports = router;
