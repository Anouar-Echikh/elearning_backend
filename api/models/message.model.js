const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = Schema({
  content: { type: String, text: true },
  readen: { type: Boolean },
  recycleBin: { type: Boolean }, //corbeille :true or false
  sender_Id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  receiver_Id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  created: { type: Date, default: new Date() }
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
