const Skills = require('../models/skills');
const User = require('../models/user');

const createSkills = async (req, res) => {
  try {
    const { skillname } = req.body;
    const skills = new Skills({ skillname });
    await skills.save();
  } catch (error) {
    console.error('Error updating education:', error);
  }
};
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skills.find();

    res.status(200).json({ skills });
  } catch (error) {
    console.error('Error fetching all skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const AffectSkillToUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const { skillname } = req.body;
    let skill = await Skills.findOne({ skillname });
    if (!skill) {
      skill = new Skills({ skillname });
      await skill.save();
    }
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.skills.includes(skill._id)) {
      return res.status(200).json({ message: "Skill already exists in user's selection" });
    }
    user.skills.push(skill._id);
    await user.save();

    res.status(200).json({ message: 'Skill added to user successfully' });
  } catch (error) {
    console.error('Error affecting skill to user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const SkilsByUserid = async (req, res) => {
  try {
    const { userID } = req.params;

    // Find the user by ID and populate the 'skills' field to retrieve the skill names
    const user = await User.findById(userID).populate('skills', 'skillname');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract skill names from the populated 'skills' array
    const skillNames = user.skills.map((skill) => skill.skillname);

    // Send response with skill names
    res.status(200).json({ skills: skillNames });
  } catch (error) {
    console.error('Error fetching skills by user ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const RemoveSkillFromUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const { skillname } = req.body;
    const skill = await Skills.findOne({ skillname });
    console.log(skill);
    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the skill exists in the user's skills array
    const skillIndex = user.skills.indexOf(skill._id);
    if (skillIndex === -1) {
      return res
        .status(404)
        .json({ message: "Skill not found in user's selection" });
    }

    // Remove the skill from the user's skills array
    user.skills.splice(skillIndex, 1);

    // Save the updated user document
    await user.save();

    // Send success response
    res
      .status(200)
      .json({ message: "Skill removed from user's selection successfully" });
  } catch (error) {
    console.error("Error removing skill from user's selection:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createSkills,
  AffectSkillToUser,
  SkilsByUserid,
  RemoveSkillFromUser,
  getAllSkills,
};
