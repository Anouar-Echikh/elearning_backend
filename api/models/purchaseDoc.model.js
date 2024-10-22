const mongoose = require("mongoose");

const { Schema } = mongoose;

const PurchaseDocSchema = Schema({
  refdoc: { type: String, index: true, required: true, text: true },
  type: { type: String },
  date: { type: Date },
  supplier: { type: mongoose.Types.ObjectId, ref: "Supplier" },
  details: [{ type: mongoose.Types.ObjectId, ref: "DetailsDoc" }],
  note: { type: String },
  created: { type: Date, default: new Date() },

  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const PurchaseDoc = mongoose.model("PurchaseDoc", PurchaseDocSchema);

module.exports = PurchaseDoc;
