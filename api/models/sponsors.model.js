const mongoose = require("mongoose");

const { Schema } = mongoose;

const SponsorSchema = Schema({
  titleAr: { type: String },
  titleFr: { type: String },
  titleEn: { type: String },
  checked :{type:String},
  image: { type: Object },
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  user:{type:String}
});

const SPONSOR = mongoose.model("Sponsors", SponsorSchema);

module.exports=  SPONSOR;
