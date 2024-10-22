const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProgramSchema = Schema({
  idEvent:{ type: mongoose.Types.ObjectId},
  date:{type:Date},
  timeStart:{type:Date},
  timeEnd:{type:Date},
  descAr: { type: String },
  descFr: { type: String },
  descEn: { type: String },
  authorAr: { type: String },
  authorFr: { type: String },
  authorEn: { type: String },
  authorImg: { type: Object },
  localAr:{type:String},
  localFr:{type:String},
  localEn:{type:String},
  files: [{ type: Object }],
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Program = mongoose.model("Program", ProgramSchema);

module.exports = Program;
