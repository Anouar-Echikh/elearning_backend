const Department = require("../models/department.model");
//const Org = require("../models/organization.model");

const DepartmentController = {};

//create a News
DepartmentController.create = async (req, res, next) => {
  const {
    name,
    organization,
 image
    } = req.body;
  const newDep = new Department({
    name,
    organization,
    image,
    created:new Date(),
    user: req.user
  });

  try {
    const savedDep = await newDep.save();
    res.send({
      success: true,
      id: savedDep._id,
      savedDep
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
DepartmentController.getAll=async(req, res,next)=>{
  const idOrg=req.params.orgId;

try{

  const list=await Department.find({organization: idOrg});
  //const list=await News.find();
  
  res.send({departments:list})

}catch(e){
next(e)
}

}
//Get all Newss by Event Id
DepartmentController.getOneById=async(req, res,next)=>{
  const id=req.params.id;
  
  try{
     const oneDep= await Department.findById(id);
  
     res.send({oneDep})
  }catch(e){
  next(e)
  }
  
  }

//destroy News oneBy Id
DepartmentController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Department.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Dep deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};



// update News
// patch News
DepartmentController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedDep = await Department.updateOne(
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

module.exports = DepartmentController;
