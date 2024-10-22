const mongoose = require("mongoose");

const { Schema } = mongoose;

const EventSchema = Schema({
    dateEnd:{type:Date},
    dateStart:{type:Date},
    category: { type: String },
    selectGov: { type: String },
    selectCity: { type: String },
    placeAr:{ type: String },
    placeFr: { type: String },
    placeEn: { type: String },
titleAr: { type: String },
  titleFr: { type: String },
  titleEn: { type: String },
  descAr: { type: String },
  descFr: { type: String },
  descEn: { type: String },
  image: { type: Object },
  showIn:{type:String},// show event in home page true/false
  order:{type:Number},//order showing in home page if showIn True 
  program:[{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
