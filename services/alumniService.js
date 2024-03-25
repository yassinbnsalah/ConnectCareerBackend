const User = require('../models/user');


async function getListeAlumni() {
  try {
    const recruiters = await User.find({ role: 'Alumni' }).populate(
      'entreprise',
    );
    return recruiters;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return res;
  }
}



async function getAlumniDetails(alumniId) {
  try {
    const alumni = await User.findById(alumniId).populate('entreprise');
    return alumni;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

module.exports = {
  getListeAlumni,
  getAlumniDetails
};
