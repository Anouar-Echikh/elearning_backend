const mongoose = require("mongoose");

const { Schema } = mongoose;

const ClientSchema = Schema({
  nAccount: { type: String, index: true, required: true },
  name: { type: String, text: true },
  quality: { type: String },
  refClient: { type: String }, //cin  or code tva
  phone: { type: String },
  email: { type: String },
  region: { type: String },
  adress: { type: String },
  zipCode: { type: String },
  note: { type: String }, //actif, passif ou supprimé
  type: { type: String }, //revendeur, super client ou simple client
  created: { type: Date, default: new Date() }, //date de creation
  lastUpdate: { type: Date }, // date de la dernière mise à jour
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
