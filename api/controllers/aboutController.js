const About = require("../models/about.model");

const aboutController = {};
     
aboutController.get = async (req, res, next) => {
  const user = req.user;
  const query = {
    user: user._id
  };
  try {
    const about = await About.find();
    return res.send({
      about
    });
  } catch (e) {
    next(e);
  }
};

aboutController.create = async (req, res, next) => {
  const { descriptionAr,descriptionFr,descriptionEn,goalsAr,goalsFr,goalsEn } = req.body;
  const data_about = new About({
    descriptionAr,
    descriptionFr,
    descriptionEn,
    goalsEn,
    goalsAr,
    goalsFr,
    created:new Date(),
    user: req.user
  });

  try {
      
        const savedAbout = await data_about.save();
        return res.send({
          success: true,
          about: savedAbout
        });
          
      
  } catch (e) {
    next(e);
  }
};

aboutController.update = async (req, res, next) => {
    const { descriptionAr,descriptionFr,descriptionEn,goalsAr,goalsFr,goalsEn } = req.body;
  const about_id = req.params.id;

  try {
    const updatedAbout = await About.updateOne(
      { _id: about_id },
      { descriptionAr,
        descriptionFr,
        descriptionEn,
        goalsAr,
        goalsFr,
        goalsEn,
        modified:new Date() 
    }
    );
    return res.send({
      success: true,
      updatedAbout
    });
  } catch (e) {
    next(e);
  }
};

aboutController.patch = async (req, res, next) => {
  const body=req.body;
const about_id = req.params.id;

try {
  const updatedAbout = await About.updateOne(
    { _id: about_id },
    body
  );
  return res.send({
    success: true,
    updatedAbout
  });
} catch (e) {
  next(e);
}
};

module.exports = aboutController;
