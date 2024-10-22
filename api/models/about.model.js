const mongoose = require("mongoose");

const { Schema } = mongoose;

const AboutSchema = Schema({
  descriptionAr: { type: String },
  descriptionFr: { type: String },
  descriptionEn: { type: String },
  goalsAr: { type: Array },
  goalsFr: { type: Array },
  goalsEn: { type: Array },
  created: { type: Date, default: new Date() },
  modified: { type: Date },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const About = mongoose.model("About", AboutSchema);

module.exports = About;
