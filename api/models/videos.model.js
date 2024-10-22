const mongoose = require("mongoose");

const { Schema } = mongoose;

const VideoSchema = Schema({
  title: { type: String },
  module: { type: String },
  prof: {  
    type: mongoose.Types.ObjectId,
    ref: "User" },
  description: { type: String },
  urlVideo: { type: String },
  thumbnail: { type: String },
  chapters:[{ type: Object }],
  files:[{ type: Object }],
  created: { type: Date, default: new Date() },   
  lastUpdate: { type: Date },
  theme:{ 
    type: mongoose.Types.ObjectId,
    ref: "Theme"
  },
  user:{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const VIDEO = mongoose.model("Video", VideoSchema);

module.exports = VIDEO;
