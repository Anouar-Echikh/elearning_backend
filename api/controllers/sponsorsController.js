const Sponsor = require("../models/sponsors.model");
//import Sponsor from "../models/sponsors.model"
const SponsorsController = {};

//create a News
SponsorsController.create = async (req, res, next) => {
  const {
    titleAr,
    titleFr,
    titleEn,
    checked,
    image} = req.body;
  const newSponsor = new Sponsor({
    titleAr,
    titleFr,
    titleEn,
    checked,
    image,
    created:new Date(),
    user: req.user.name
  });

  try {
    const savedSponsor = await newSponsor.save();
    res.send({
      success: true,
      id: savedSponsor._id
    });
  } catch (e) {
    next(e);
  }
};

//Get all sponsors
SponsorsController.getAll=async(req, res,next)=>{


try{
  const list=await Sponsor.find();
  //const list=await News.find();
  
  res.send({sponsors:list})

}catch(e){
next(e)
}

}
//Get one sponsor by id
SponsorsController.getOneById=async(req, res,next)=>{
  const id=req.params.idSponsor;
  
  try{
     const oneSponsor= Sponsor.find({_id:id});
  
     res.send({oneSponsor})
  
  }catch(e){
  next(e)
  }
  
  }

//destroy sponsor By Id
SponsorsController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Sponsor.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Sponsor deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};




// patch Sponsor
SponsorsController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedSponsor = await Sponsor.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedSponsor
    });
  } catch (e) {
    next(e);
  }
};

module.exports = SponsorsController;
