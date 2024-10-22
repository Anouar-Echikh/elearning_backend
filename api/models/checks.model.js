const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChecksSchema = Schema({
  checkNo: { type: String },
  amount: { type: Number },
  date: { type: Date },
  bankName: { type: String },
  adress: { type: String },
  accountOwner: { type: String },
  refDoc: { type: String },
  customerName: { type: String },
  customerId: { type: String },
  note: { type: String },
  status: { type: Number }, //0:en caisse,1:versé,2: payé, 3:préavis, 4:cnp
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Checks = mongoose.model("Checks", ChecksSchema);

module.exports = Checks;
