const mongoose = require("mongoose");

const { Schema } = mongoose;

const InscriptionSchema = Schema({
  qrcodeImg: {type: Object},
  name:  { type: String },
dateBirth: { type: Date},
educationLevel:  { type: String },
profession:  { type: String },
cin:  { type: String },
email:  { type: String },
tel:  { type: String },
city:  { type: String },
adress:  { type: String },
 valid :[{type:String}],//array of object=>2 params{idEvent,valid}
  avatar: { type: Object }, 
  cinPhoto: { type: Object },//object=>2 images {front,back}
  justifPay: { type: Object },//jsutificatif de payement
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date },
  user:{type:String}         
});

const Inscription = mongoose.model("Inscriptions", InscriptionSchema);

module.exports=  Inscription;
