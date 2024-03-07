const Entreprise = require("../models/entreprise");
const User = require("../models/user");

async function getListeEntreprise() {
  try {
    const recruiters = await User.find({ role: "Recruiter" }).populate(
      "entreprise"
    );
    return recruiters;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
async function getAllEntreprise() {
  try {
    const entreprises = await Entreprise.find();
    return entreprises;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
async function getEntrepriseDetails(entrepriseId) {
  try {
    // Find the entreprise by its ID
    const entreprise = await Entreprise.findById(entrepriseId);

    if (!entreprise) {
      return res.status(404).json({ message: "Entreprise not found" });
    }

    return entreprise;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

async function UpdateEntreprise(req, res, admin) {
  // const {
  //   CompanyName,
  //   CompanyAdress,
  //   CompanyType,
  //   description,
  //   CompanyCity,
  //   CompanyWebsite,
  // } = req.body;
  try {
    let entreprise = await Entreprise.findById(req.params.CompanyID);
    if (req.files["CompanyLogo"]) {
      const CompanyLogoFile = req.files["CompanyLogo"][0];
      const CompanyLogoBucket = admin.storage().bucket();
      const CompanyLogoFileObject = CompanyLogoBucket.file(
        CompanyLogoFile.originalname
      );
      await CompanyLogoFileObject.createWriteStream().end(
        CompanyLogoFile.buffer
      );
      CompanyLogo = `https://firebasestorage.googleapis.com/v0/b/${CompanyLogoBucket.name}/o/${CompanyLogoFileObject.name}`;
      entreprise.CompanyLogo = CompanyLogo;
      await entreprise.save();
    }
    const updateEntreprise = await Entreprise.findByIdAndUpdate(
      req.params.CompanyID,
      { $set: req.body },
      { new: true }
    );
    return updateEntreprise;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

async function CreateEntreprise(req, res, admin) {
  const { CompanyName, CompanyAdress, CompanyType, description, CompanyCity } =
    req.body;
  try {
    if (req.files["CompanyLogo"]) {
      const CompanyLogoFile = req.files["CompanyLogo"][0];
      const CompanyLogoBucket = admin.storage().bucket();
      const CompanyLogoFileObject = CompanyLogoBucket.file(
        CompanyLogoFile.originalname
      );
      await CompanyLogoFileObject.createWriteStream().end(
        CompanyLogoFile.buffer
      );
      CompanyLogo = `https://firebasestorage.googleapis.com/v0/b/${CompanyLogoBucket.name}/o/${CompanyLogoFileObject.name}`;
    }
    const entreprise = new Entreprise({
      CompanyName,
      CompanyAdress,
      CompanyType,
      description,
      CompanyLogo,
      CompanyCity,
    });
    await entreprise.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getListeEntreprise,
  getEntrepriseDetails,
  getAllEntreprise,
  UpdateEntreprise,
  CreateEntreprise,
};
