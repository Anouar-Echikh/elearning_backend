const mongoose = require("mongoose");

const { Schema } = mongoose;

const SaleDocSchema = Schema({
  refdoc: { type: String, index: true, required: true, text: true },
  type: { type: String },
  date: { type: Date },
  customerId: { type: String },
  name: { type: String },
  adress: { type: String },
  phone: { type: String },
  details: [{ type: mongoose.Schema.Types.ObjectId, ref: "DetailsDoc" }],
  subTotal: { type: Number },
  note: { type: String },
  initCountRef: { type: Number }, // initial refDoc count
  created: { type: Date, default: new Date() },
  validated: { type: Boolean },
  lastUpdate: { type: Date },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const SaleDoc = mongoose.model("SaleDoc", SaleDocSchema);

module.exports = SaleDoc;
