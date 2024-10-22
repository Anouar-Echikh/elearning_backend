const mongoose = require("mongoose");

const { Schema } = mongoose;

const DetailsDocSchema = Schema({
  product: { type: String },
  docId: { type: String },
  description: { type: String },
  quantity: { type: Number },
  unite: { type: String },
  price: { type: Number },
  rem: { type: Number } //discount
});

const DetailsDoc = mongoose.model("DetailsDoc", DetailsDocSchema);

module.exports = DetailsDoc;
