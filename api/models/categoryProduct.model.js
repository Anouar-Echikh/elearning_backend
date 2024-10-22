const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategoryProductSchema = Schema({
  refCategory: { type: String, text: true },
  designation: { type: String },
  note: { type: String },
  created: { type: Date, default: new Date() },

  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const CategoryProduct = mongoose.model(
  "CategoryProduct",
  CategoryProductSchema
);

module.exports = CategoryProduct;
