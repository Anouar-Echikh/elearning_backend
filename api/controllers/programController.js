const Program = require("../models/program.model");

const ProgramController = {};

//create a Program
ProgramController.create = async (req, res, next) => {
  const {idEvent,
    date,
    timeStart,
    timeEnd,
    descAr,
    descFr,
    descEn,
    authorAr,
  authorFr,
  authorEn,
  authorImg,
  localAr,
  localFr,
  localEn,
    files} = req.body;
  const newProgram = new Program({
    idEvent,
    date,
    timeStart,
    timeEnd,
    descAr,
    descFr,
    descEn,
    authorAr,
    authorFr,
    authorEn,
    authorImg,
    localAr,
    localFr,
    localEn,
    files,
    created:new Date(),
    user: req.user
  });

  try {
    const savedProgram = await newProgram.save();
    res.send({
      success: true,
      id: savedProgram._id
    });
  } catch (e) {
    next(e);
  }
};

//Get all programs by Event Id
ProgramController.getAllByEventId=async(req, res,next)=>{
let id=req.params.idEvent;

try{
  const list=await Program.find({idEvent:id});
  //const list=await Program.find();
  
  res.send({programs:list})

}catch(e){
next(e)
}

}
//Get all programs by Event Id
ProgramController.getOneById=async(req, res,next)=>{
  const id=req.params.idProgram;
  
  try{
     const program= Program.find({_id:id});
  
     res.send({program})
  
  }catch(e){
  next(e)
  }
  
  }

//destroy program oneBy Id
ProgramController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Program.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Program deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

//destroy all programs by Event id
ProgramController.destroyAllByEventId = async (req, res, next) => {
    const id = req.params.idEvent;
  
    try {
      await Program.deleteMany({idEvent: id });
      return res.send({
        success: true,
        message: "All programs related to this event are deleted with success!"
      });
    } catch (e) {
      next(e);
    }
  };

// update Program
ProgramController.update = async (req, res, next) => {
  const { idEvent,
  date,
  timeStart,
  timeEnd,
  descAr,
  descFr,
  descEn,
  authorAr,
  authorFr,
  authorEn,
  authorImg,
  localAr,
  localFr,
  localEn,
  files } = req.body;
  const id = req.params.id;

  try {
    const updatedProgram = await Program.updateOne(
      { _id: id },
      {
        $set: {
            date,
            timeStart,
            timeEnd,
            descAr,
            descFr,
            descEn,
            authorAr,
            authorFr,
            authorEn,
            authorImg,
            localAr,
            localFr,
            localEn,
            files,
          lastUpdate: { type: new Date() }
        }
      }
    );
    
    res.send({
      success: true,
      updatedProgram
    });
  } catch (e) {
    next(e);
  }
};

// patch Program
ProgramController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedProgram = await Program.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedProgram
    });
  } catch (e) {
    next(e);
  }
};

module.exports = ProgramController;
