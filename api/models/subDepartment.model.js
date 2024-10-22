const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubDepartmentSchema = Schema({
   name:{type:String},
   image: { type: Object },
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  students:[{type: Object }],
  professors:[{type: Object}],
  department:{ 
    type: mongoose.Types.ObjectId,
    ref: "Department"
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const SubDepartment = mongoose.model("SubDepartment", SubDepartmentSchema);

module.exports = SubDepartment;
