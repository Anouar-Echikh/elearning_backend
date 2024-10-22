const SubDepartment = require("../models/subDepartment.model");

const SubDepartmentController = {};

//create a News
SubDepartmentController.create = async (req, res, next) => {
  const {
    name,
    department,
 image
    } = req.body;
  const newDep = new SubDepartment({
    name,
    department,
    image,
    created:new Date(),
    user: req.user
  });

  try {
    const savedSubDep = await newDep.save();
    res.send({
      success: true,
      id: savedSubDep._id,
      savedSubDep
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
SubDepartmentController.getAll=async(req, res,next)=>{
  const idDep=req.params.depId;

try{
 const list=await SubDepartment.find({department:idDep});
  //const list=await SubDepartment.find();
  //const list=await News.find();
  
  res.send({subDepartments:list})

}catch(e){
next(e)
}

}
//Get all Newss by Event Id
SubDepartmentController.getOneById=async(req, res,next)=>{
  const id=req.params.id;
  
  try{
     const oneSubDep= await SubDepartment.findById(id);
  
     res.send({oneSubDep})
  }catch(e){
  next(e)
  }
  
  }

//destroy News oneBy Id
SubDepartmentController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await SubDepartment.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Dep deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// delete many subDepartment

SubDepartmentController.deleteManyByIdDepartment = async (req, res, next) => {
  const id = req.params.id;

  try {
    await SubDepartment.deleteMany({ department: id });
    return res.send({
      success: true,
      message: "Formations deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};


// update News
// patch News
SubDepartmentController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedDep = await SubDepartment.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedDep
    });
  } catch (e) {
    next(e);
  }
};

module.exports = SubDepartmentController;
