const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentsSchema = Schema({
  parentId: { type: String },
  validatedByAdmin:{type:Boolean,default:false},
  comment: { type: String },
  postId: { type: String },
  replies:[{type: mongoose.Schema.Types.ObjectId, ref: "Comments"}],
  created: { type: Date, default: new Date() },   
  lastUpdate: { type: Date },
  user:{type:Object}
});

const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;
