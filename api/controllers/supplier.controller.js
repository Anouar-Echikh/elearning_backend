const Supplier = require("../models/supplier.model");

const supplierController = {};

//get all suppliers
supplierController.getAllSupliers = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const suppliers = await Supplier.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user"
        }
      }
    ]);
    if (suppliers.length > 0) {
      res.send({ suppliers });
    } else {
      res.status(401);
      res.send({ error: "No suppliers" });
    }
  } catch (e) {
    next(e);
  }
};

// Get supplier by Id

supplierController.getSupplierById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundSupplier = await Supplier.findOne({
      _id: id
    });

    if (foundSupplier) {
      res.send({ supplier: foundSupplier });
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

// Get supplier by n° account

supplierController.getSupplierByNumAccount = async (req, res, next) => {
  const num = req.params.numAccount;
  try {
    const foundSupplier = await Supplier.findOne({
      nAccount: num
    });

    if (foundSupplier) {
      res.send({ supplier: foundSupplier });
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

//create supplier
supplierController.create = async (req, res, next) => {
  const {
    nAccount,
    name,
    quality,
    idCient,
    phone,
    email,
    region,
    adress,
    zipCode,
    note
  } = req.body;
  const newSupplier = new Supplier({
    nAccount,
    name,
    quality,
    idCient,
    phone,
    email,
    region,
    adress,
    zipCode,
    note,
    owner: req.user
  });

  try {
    const savedSupplier = await newSupplier.save();
    res.send({
      success: true,
      supplier: savedSupplier
    });
  } catch (e) {
    next(e);
  }
};

//destroy supplier
supplierController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Supplier.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "supplier deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update supplier
supplierController.update = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  var updatedSupplier = {};
  try {
    if ("name" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            name: body.name,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("nAccount" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            nAccount: body.nAccount,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("quality" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            quality: body.quality,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("refSupplier" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            refSupplier: body.refSupplier,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("phone" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            phone: body.phone,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("email" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            email: body.email,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("region" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            region: body.region,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("adress" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            adress: body.adress,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("zipCode" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            zipCode: body.zipCode,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("note" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            note: body.note,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("type" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            type: body.type,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("quality" in body) {
      updatedSupplier = await Supplier.updateOne(
        { _id: id },
        {
          $set: {
            quality: body.quality,
            lastUpdate: new Date()
          }
        }
      );
    }

    if (updatedSupplier.ok === 1) {
      res.send({
        success: true
      });
    } else {
      res.send({
        success: false,
        updatedSupplier,
        error: "Problème de mise à jour supplier"
      });
    }
  } catch (e) {
    next(e);
  }
};

/*---------------Get all Suppliers by search text-------------------*/
supplierController.getAllSuppliersBySearchText = async (req, res, next) => {
  const currentUser_id = req.user._id;
  const text = req.params.text;
  try {
    const Suppliers = await Supplier.find(
      {
        owner: currentUser_id,
        $text: { $search: text }
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.send({
      Suppliers
    });
  } catch (e) {
    next(e);
  }
};

module.exports = supplierController;
