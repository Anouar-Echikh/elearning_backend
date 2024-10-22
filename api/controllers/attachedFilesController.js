const File = require("../models/File.model");

const FileController = {};

//create a News
FileController.create = async (req, res, next) => {
  const {
    title,
  description,
  url, 
    video
  } = req.body;
  const newVideo = new File({
    title,
  description,
  url,
  
  
    video,
    created:new Date(),
    user: req.user.name
  });

  try {
    const savedFile = await newFile.save();
    res.send({
      success: true,
      id: savedFile._id
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
FileController.getAll=async(req, res,next)=>{


try{
  const list=await File.find();
   
  res.send({Files:list})

}catch(e){
next(e)
}

}
//Get all Newss by Event Id
FileController.getOneById=async(req, res,next)=>{
  const id=req.params.idVideo;
  
  try{
     const oneFile= File.find({_id:id});
  
     res.send({oneFile})
  
  }catch(e){
  next(e)
  }
  
  }

//destroy News oneBy Id
FileController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await File.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Video deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};



// update News
// patch News
FileController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedFile = await File.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedFile
    });
  } catch (e) {
    next(e);
  }
};

module.exports = FileController;
