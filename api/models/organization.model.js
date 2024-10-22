const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator"); //is to validate  duplicated field
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const OrganizationSchema = Schema({
  name: { type: String },
  prefix: { type: String },
  selectGov: { type: String },
  adress: { type: String },
  selectCity: { type: String },
  tel1: { type: String },
  tel2: { type: String },
  image: { type: Object },
  homeHeaderImage:{ type: Object },
  homeContactImage:{ type: Object },
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});


//OrganizationSchema.plugin(validator); we don't DidUpdate to this plugin because the error is already handled in the controller
const Organization = mongoose.model("Organization", OrganizationSchema);

module.exports = Organization;

