const mongoose = require("mongoose");

const { Schema } = mongoose;

const DepartmentSchema = Schema({
   name:{type:String},
   image: { type: Object },
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  organization:{ 
    type: mongoose.Types.ObjectId,
    ref: "Organization"
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
