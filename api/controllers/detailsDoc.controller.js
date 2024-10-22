const DetailsDoc = require("../models/detailsDoc.model");
const SaleDoc = require("../models/saleDoc.model");
const saleDocController = require("../controllers/saleDoc.controller");

const DetailsDocController = {};

//create DetailsDoc
DetailsDocController.create = async (req, res, next) => {
  const { product, docId, description, quantity, unite, price, rem } = req.body;
  const newDetailsDoc = new DetailsDoc({
    product,
    docId,
    description,
    quantity,
    unite,
    price,
    rem,
    owner: req.user
  });

  try {
    const savedDetailsDoc = await newDetailsDoc.save();
    res.send({
      success: true,
      id: savedDetailsDoc._id
    });
  } catch (e) {
    next(e);
  }
};

//destroy DetailsDoc
DetailsDocController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await DetailsDoc.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "DetailsDoc deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update DetailsDoc
DetailsDocController.update = async (req, res, next) => {
  const { product, docId, description, quantity, unite, price, rem } = req.body;
  const id = req.params.id;

  try {
    const updatedDetailsDoc = await DetailsDoc.updateOne(
      { _id: id },
      {
        $set: {
          product,
          description,
          quantity,
          unite,
          price,
          rem,
          lastUpdate: { type: new Date() }
        }
      }
    );
    //update Total amount Doc
    await saleDocController.updateAmount(docId);

    res.send({
      success: true,
      updatedDetailsDoc
    });
  } catch (e) {
    next(e);
  }
};

module.exports = DetailsDocController;
