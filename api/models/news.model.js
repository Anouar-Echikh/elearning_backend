const mongoose = require("mongoose");

const { Schema } = mongoose;

const NewsSchema = Schema({
  titleAr: { type: String },
  titleFr: { type: String },
  titleEn: { type: String },
  descAr: { type: String },
  descFr: { type: String },
  descEn: { type: String },
  authorImg: { type: Object },
  image: { type: Object },
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  // user: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "User"
  // }
  user:{type:String}
});

const NEWS = mongoose.model("News", NewsSchema);

module.exports = NEWS;
