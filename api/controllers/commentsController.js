const Comment = require("../models/comments.model");

const CommentController = {};

//create a News
CommentController.create = async (req, res, next) => {
  const {
    parentId,
    comment,
    postId,
    validatedByAdmin,
    replies,
    } = req.body;
  const newComment = new Comment({
    parentId,
    comment,
    postId,
    validatedByAdmin,
    replies,
    created:new Date(),
    user: req.user
  });

  try {
    const savedComment = await newComment.save();
    res.send({
      success: true,
      savedComment
    });
  } catch (e) {
    next(e);
  }
};

//Get all Newss by Event Id
CommentController.getAllByPostId=async(req, res,next)=>{
let id=req.params.id

try{
  const list=await Comment.find({postId:id,parentId:"root"})
  .sort({created:-1})
  .populate({ path: "replies", model: "Comments" });
 
  
  res.send({comments:list})

}catch(e){
next(e)
}

}
//Get all Newss by Event Id
CommentController.getOneById=async(req, res,next)=>{
  const id=req.params.id;
  
  try{
     const oneComment= Comment.find({_id:id});
  
     res.send({oneComment})
  
  }catch(e){
  next(e)
  }
  
  }

//destroy News oneBy Id
CommentController.destroyOneById = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Comment.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Comment deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};



// update News
// patch News
CommentController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedComment = await Comment.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedComment,
      body
    });
  } catch (e) {
    next(e);
  }
};

// delete many comments

CommentController.deleteManyByPostId = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Comment.deleteMany({ postId: id });
    return res.send({
      success: true,
      message: "Comments deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

module.exports = CommentController;
