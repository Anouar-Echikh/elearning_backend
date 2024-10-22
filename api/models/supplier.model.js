const mongoose = require("mongoose");

const { Schema } = mongoose;

const SupplierSchema = Schema({
  nAccount: { type: String, index: true, required: true },
  name: { type: String, text: true },
  refSupplier: { type: String }, //cin  or code tva
  phone: { type: String },
  email: { type: String },
  region: { type: String },
  adress: { type: String },
  zipCode: { type: String },
  note: { type: String },
  created: { type: Date, default: new Date() }, //date de creation
  lastUpdate: { type: Date }, // date de la dernière mise à jour
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Supplier = mongoose.model("Supplier", SupplierSchema);

module.exports = Supplier;


