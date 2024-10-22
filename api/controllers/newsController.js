const News = require("../models/news.model");

const NewsController = {};

//create a News
NewsController.create = async (req, res, next) => {
  const {
    titleAr,
    titleFr,
    titleEn,
    descAr,
    descFr,
    descEn,
    image} = req.body;
  const newNews = new News({
    titleAr,
    titleFr,
    titleEn,
    descAr,
    descFr,
    descEn,
    image,
    created:new Date(),
    user: req.user.name
  });

  try {
    const savedNews = await newNews.save();
    res.send({
      success: true,
      id: savedNews._id
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
NewsController.getAll=async(req, res,next)=>{


try{
  const list=await News.find().sort({"created":1});
  //const list=await News.find();
  
  res.send({news:list})

}catch(e){
next(e)
}

}
//Get all Newss by Event Id
NewsController.getOneById=async(req, res,next)=>{
  const id=req.params.idNews;
  
  try{
     const oneNews= News.find({_id:id});
  
     res.send({oneNews})
  
  }catch(e){
  next(e)
  }
  
  }

//destroy News oneBy Id
NewsController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await News.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "News deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};



// update News
// patch News
NewsController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedNews = await News.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedNews
    });
  } catch (e) {
    next(e);
  }
};

module.exports = NewsController;
