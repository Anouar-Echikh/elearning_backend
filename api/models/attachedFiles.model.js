const mongoose = require("mongoose");

const { Schema } = mongoose;

const AttachedFilesSchema = Schema({
  title: { type: String },
  description: { type: String },
  url: { type: String },
  video: { type: Object },// title,category,level,prof
  created: { type: Date, default: new Date() },   
  lastUpdate: { type: Date },
  user:{type:Object}
});

const AttachedFiles = mongoose.model("AttachedFiles", AttachedFilesSchema);

module.exports = AttachedFiles;
