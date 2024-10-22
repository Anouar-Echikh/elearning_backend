const Videos = require("../models/videos.model");

const VideosController = {};

//create a News
VideosController.create = async (req, res, next) => {
  const {
prof,
    title,
  theme,
  
  module,
  description,
  urlVideo,
  thumbnail,
  chapters,
     
    } = req.body;
  const newVideo = new Videos({
    prof,
    title,
  theme,
  module,
  description,
  urlVideo,
  thumbnail,
  chapters,
    created:new Date(),
    user: req.user._id
  });

  try {
    const savedVideo = await newVideo.save();
    res.send({
      success: true,
      id: savedVideo._id,
      savedVideo
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
VideosController.getAllByTheme=async(req, res,next)=>{

  const idTheme=req.params.idTheme;
try{
  const list=await Videos.find({theme:idTheme})
  .populate({
    path: "theme", select: "title", model: "Theme",
    populate: ({
      path: "subDepartment", select: "name students professors", model: "SubDepartment",
      populate: ({ path: "department", select: "name", model: "Department" })
    })
  })
  .populate({ path: "prof", select: "name", model: "User" })
  //const list=await News.find();
  
  res.send({videos:list})

}catch(e){
next(e)
}

}


//Get all Newss by Event Id
VideosController.getAllByProf=async(req, res,next)=>{

  const idProf=req.params.idProf;
try{
  const list=await Videos.find({prof:idProf})
  .populate({
    path: "theme", select: "title", model: "Theme",
    populate: ({
      path: "subDepartment", select: "name students professors", model: "SubDepartment",
      populate: ({ path: "department", select: "name", model: "Department" })
    })
  })
  .populate({ path: "prof", select: "name", model: "User" })
  //const list=await News.find();
  
  res.send({videos:list})

}catch(e){
next(e)
}

}

//Get all Newss by Event Id
VideosController.getOneById=async(req, res,next)=>{
  const id=req.params.id;
  
  try{
     const oneVideo= await Videos.findById(id)
     .populate({
      path: "theme", select: "title", model: "Theme",
      populate: ({
        path: "subDepartment", select: "name students professors", model: "SubDepartment",
        populate: ({ path: "department", select: "name", model: "Department" })
      })
    })
    .populate({ path: "prof", select: "name", model: "User" })
  
     res.send({oneVideo})
  }catch(e){
  next(e)
  }
  
  }

//destroy News oneBy Id
VideosController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Videos.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Video deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// delete many videos

VideosController.deleteManyByIdTheme = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Videos.deleteMany({ theme: id });
    return res.send({
      success: true,
      message: "Videos deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};


// update News
// patch News
VideosController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedVideo = await Videos.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedVideo
    });
  } catch (e) {
    next(e);
  }
};

module.exports = VideosController;
