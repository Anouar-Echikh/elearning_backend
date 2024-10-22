const Organization = require("../models/organization.model");

const OrganizationController = {};

//create a News
OrganizationController.create = async (req, res, next) => {
  const {
   name,
    selectGov,
    adress,
    selectCity,
  tel1,
  tel2,
  prefix,
     image
    } = req.body;
  const newOrg = new Organization({
    name,
    selectGov,
    adress,
    selectCity,
  tel1,
  tel2,
  prefix,
     image,
    created:new Date(),
    user: req.user
  });

  try {
    const savedOrg = await newOrg.save();
    res.send({
      success: true,
      id: savedOrg._id,
      savedOrg
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
OrganizationController.getAll=async(req, res,next)=>{


try{
  const list=await Organization.find();
  //const list=await News.find();
  
  res.send({organizations:list})

}catch(e){
next(e)
}

}
//Get all Newss by Event Id
OrganizationController.getOneById=async(req, res,next)=>{
  const id=req.params.id;
  
  try{
     const oneOrg= await Organization.findById(id);
  
     res.send({oneOrg})
  }catch(e){
  next(e)
  }
  
  }

  //Get all Newss by Event Id
OrganizationController.getOneByPrefix=async(req, res,next)=>{
  const pref=req.params.prefix;
  
  try{
     const orgs= await Organization.find({prefix:pref});
  
     res.send({oneOrg:orgs[0]})
  }catch(e){
  next(e)
  }
  
  }


//destroy News oneBy Id
OrganizationController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Organization.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Org deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};



// update News
// patch News
OrganizationController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedOrg = await Organization.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedOrg
    });
  } catch (e) {
    next(e);
  }
};

module.exports = OrganizationController;
