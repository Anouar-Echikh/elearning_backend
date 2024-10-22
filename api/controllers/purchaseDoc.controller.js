const PurchaseDoc = require("../models/product.model");

const PurchaseDocController = {};
//ok
//get all PurchaseDocs for all users
PurchaseDocController.getAllPurchaseDocsAllUsers = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const PurchaseDocs = await Contact.find();
    if (PurchaseDocs.length > 0) {
      res.send({ PurchaseDocs });
    } else {
      res.status(401);
      res.send({ error: "No PurchaseDocs for you" });
    }
  } catch (e) {
    next(e);
  }
};
//get all PurchaseDocs for current user
PurchaseDocController.getAllPurchaseDocsCurrentUser = async (
  req,
  res,
  next
) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const PurchaseDocs = await Contact.find({ query });
    if (PurchaseDocs.length > 0) {
      res.send({ PurchaseDocs });
    } else {
      res.status(401);
      res.send({ error: "No PurchaseDocs for you" });
    }
  } catch (e) {
    next(e);
  }
};

// Get PurchaseDoc by Id

PurchaseDocController.getPurchaseDocById = async (req, res, next) => {
  const id = req.params.id;
  const query = {
    owner: user._id
  };
  try {
    const foundPurchaseDoc = await PurchaseDoc.findOne({
      _id: id,
      query
    });

    if (foundPurchaseDoc) {
      res.send({ PurchaseDoc: foundPurchaseDoc });
    } else {
      res.status(401);
      res.send({
        error: `Ce compte n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get PurchaseDoc by ref PurchaseDoc

PurchaseDocController.getPurchaseDocByRef = async (req, res, next) => {
  const ref = req.params.ref;
  const query = {
    owner: user._id
  };
  try {
    const foundPurchaseDoc = await PurchaseDoc.findOne({
      refPurchaseDoc: ref,
      query
    });

    if (foundPurchaseDoc) {
      res.send({ PurchaseDoc: foundPurchaseDoc });
    } else {
      res.status(401);
      res.send({
        error: `Ce document d'achat n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get PurchaseDoc by ref PurchaseDoc

PurchaseDocController.getPurchaseDocsByType = async (req, res, next) => {
  const type = req.params.type;
  const query = {
    owner: user._id
  };
  try {
    const foundPurchaseDocs = await PurchaseDoc.findOne({
      type,
      query
    });

    if (foundPurchaseDoc) {
      res.send({ PurchaseDocs: foundPurchaseDocs });
    } else {
      res.status(401);
      res.send({
        error: `Vous n'avez aucun document d'achat de ce type.`
      });
    }
  } catch (e) {
    next(e);
  }
};

//create PurchaseDoc
PurchaseDocController.create = async (req, res, next) => {
  const { refdoc, type, date, products, supplier, subTotal, note } = req.body;
  const newPurchaseDoc = new PurchaseDoc({
    refdoc,
    type,
    date,
    subTotal,
    products,
    supplier,
    note,
    owner: req.user
  });

  try {
    const savedPurchaseDoc = await newPurchaseDoc.save();
    res.send({
      success: true,
      PurchaseDoc: savedPurchaseDoc
    });
  } catch (e) {
    next(e);
  }
};

//destroy PurchaseDoc
PurchaseDocController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await PurchaseDoc.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "PurchaseDoc deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update PurchaseDoc
PurchaseDocController.update = async (req, res, next) => {
  const { refdoc, type, date, products, supplier, note } = req.body;
  const id = req.params.id;

  try {
    const updatedPurchaseDoc = await PurchaseDoc.updateOne(
      { _id: id },
      {
        refdoc,
        type,
        date,
        products,
        subTotal,
        supplier,
        note,
        lastUpdate: { type: new Date() }
      }
    );
    return res.send({
      success: true,
      updatedPurchaseDoc
    });
  } catch (e) {
    next(e);
  }
};

/*---------------Get all PurchaseDocs by search text-------------------*/
PurchaseDocController.getAllPurchaseDocsBySearchText = async (
  req,
  res,
  next
) => {
  const currentUser_id = req.user._id;
  const text = req.params.text;
  try {
    const PurchaseDocs = await PurchaseDoc.find(
      {
        owner: currentUser_id,
        $text: { $search: text }
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.send({
      PurchaseDocs
    });
  } catch (e) {
    next(e);
  }
};

module.exports = PurchaseDocController;
