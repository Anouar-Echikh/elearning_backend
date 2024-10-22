const Themes = require("../models/themes.model");

const ThemesController = {};

//create a News
ThemesController.create = async (req, res, next) => {
  const {
    title,
 
 image,
 subDepartment
    } = req.body;
  const newTheme = new Themes({
    title,
   
    image,
    subDepartment,
    created:new Date(),
    user: req.user
  });

  try {
    const savedTheme = await newTheme.save();
    res.send({
      success: true,
      id: savedTheme._id,
      savedTheme
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
ThemesController.getAll=async(req, res,next)=>{
let subDepId=req.params.idSubDep

try{
  const list=await Themes.find({subDepartment:subDepId});
  //const list=await News.find();
  
  res.send({themes:list})

}catch(e){
next(e)
}

}
//Get all Newss by Event Id
ThemesController.getOneById=async(req, res,next)=>{
  const id=req.params.id;
  
  try{
     const oneTheme= await Themes.findById(id);
  console.log("id:",id)
  console.log("oneTheme:",oneTheme)
     res.send({oneTheme})
  }catch(e){
  next(e)
  }
  
  }

//destroy News oneBy Id
ThemesController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Themes.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Theme deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// delete many themes

ThemesController.deleteManyByIdFormation = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Themes.deleteMany({ subDepartment: id });
    return res.send({
      success: true,
      message: "Themes deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update News
// patch News
ThemesController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedTheme = await Themes.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedTheme
    });
  } catch (e) {
    next(e);
  }
};

module.exports = ThemesController;
