const mongoose = require("mongoose");

const { Schema } = mongoose;

const ThemeSchema = Schema({
  title: { type: String },
  image: { type: Object },
  created: { type: Date, default: new Date() },   
  lastUpdate: { type: Date },
  subDepartment:{ 
    type: mongoose.Types.ObjectId,
    ref: "SubDepartment"
  },
  user:{type:String}
});

const THEME = mongoose.model("Theme", ThemeSchema);

module.exports = THEME;
