const mongoose = require("mongoose");

const { Schema } = mongoose;

const CompanySchema = Schema({
  nAccount: { type: String, index: true, required: true },
  name: { type: String, text: true },
  codeTva: { type: String }, //matricule fiscale
  phone: { type: "String", required: true },
  email: { type: "String", required: true },
  region: { type: String },
  adress: { type: String },
  zipCode: { type: String }, //code postal
  note: { type: String },
  startDoc: { type: Date }, // debut de l'exercice comptable
  endDoc: { type: Date }, // fin de l'exercice comptable
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },

  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
