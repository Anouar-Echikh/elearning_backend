const mongoose = require("mongoose");

const { Schema } = mongoose;

const NotificationSchema = Schema({
  note: { type: Object },
  created: { type: Date, default: new Date() },
  important: { type: Boolean },
  type: { type: String },
  idTimer:{type:Number},
  readen: { type: Boolean, default: false },
  receiverLevel: { type: String },
  receiver_Id: { type: mongoose.Types.ObjectId, ref: "User", required: true }
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
