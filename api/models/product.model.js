const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = Schema({
  refProduct: { type: String, index: true, required: true, text: true },
  designation: { type: String },
  categoryProduct: { type: String },
  note: { type: String },
  img: { type: Object },
  pa: { type: Number },
  pv: { type: Number },
  tva: { type: Number },
  rem1: { type: Number }, // taux de remise permis1
  rem2: { type: Number }, // taux de remise permis2
  rem3: { type: Number }, // taux de remise permis3
  unite: { type: String },
  stock: { type: Number },
  stockMin: { type: Number },
  stockMax: { type: Number },
  orgInStock: { type: String }, // his place in stock
  realStock: { type: Number }, //pour inventaire
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date }, // date de la dernière mise à jour
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
