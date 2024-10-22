const Inscription = require("../models/inscriptions.model");
//import Inscription from "../models/Inscriptions.model"
const InscriptionsController = {};

//create a News
InscriptionsController.create = async (req, res, next) => {
  const {
    qrcodeImg,
name,
dateBirth,
educationLevel,
profession,
cin,
email,
tel,
city,
adress,
} = req.body;

  const newInscription = new Inscription({
    qrcodeImg,
    name,
    dateBirth,
    educationLevel,
    profession,
    cin,
    email,
    tel,
    city,
    adress,
    created:new Date(),
    
  });

  try {
    const savedInscription = await newInscription.save();
    res.send({
      success: true,
      id: savedInscription._id,
      savedInscription
    });
  } catch (e) {
    next(e);
  }
};

//Get all Inscriptions
InscriptionsController.getAll=async(req, res,next)=>{


try{
  const list=await Inscription.find();
  //const list=await News.find();
  
  res.send({Inscriptions:list})

}catch(e){
next(e)
}

}
//Get one Inscription by id
InscriptionsController.getOneById=async(req, res,next)=>{
  const id=req.params.idInsc;
  
  try{
     const oneInscription= await Inscription.findOne({_id:id});
  
     res.send({oneInscription})
  
  }catch(e){
  next(e)
  }
  
  }

//destroy Inscription By Id
InscriptionsController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Inscription.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Inscription deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};




// patch Inscription
InscriptionsController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedInscription = await Inscription.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedInscription
    });
  } catch (e) {
    next(e);
  }
};

module.exports = InscriptionsController;
