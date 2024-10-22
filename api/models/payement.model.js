const mongoose = require("mongoose");

const { Schema } = mongoose;

const PayementSchema = Schema({
  refDoc: { type: String },
  customerName: { type: String },
  customerId: { type: String },
  mtEsp: { type: Number },
  mtChq: { type: Number },
  checks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Checks" }],
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  validated: { type: Boolean },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Payement = mongoose.model("Payement", PayementSchema);

module.exports = Payement;
