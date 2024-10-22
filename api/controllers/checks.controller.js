const Checks = require("../models/checks.model");

const checksController = {};

//get all Checks
checksController.getAllChecks = async (req, res, next) => {
  try {
    const checks = await Checks.find();
    if (checks.length > 0) {
      res.send({ checks });
    } else {
      res.status(401);
      res.send({ error: "No Checks" });
    }
  } catch (e) {
    next(e);
  }
};

// Get Check by Id

checksController.getCheckById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundCheck = await Checks.findOne({
      _id: id
    });

    if (foundCheck) {
      res.send({ check: foundCheck });
    } else {
      res.status(401);
      res.send({
        error: `Ce cheque n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get checks by ref of doc

checksController.getChecksByRefDoc = async (req, res, next) => {
  const ref = req.params.refDoc;
  try {
    const checks = await Checks.find({
      refDoc: ref
    });

    if (checks.length > 0) {
      res.send({ checks });
    } else {
      res.status(401);
      res.send({
        error: `Il n'y aucune cheque pour ce document.`
      });
    }
  } catch (e) {
    next(e);
  }
};

//create Check
checksController.create = async (req, res, next) => {
  const {
    checkNo,
    amount,
    date,
    bankName,
    adress,
    accountOwner,
    refDoc,
    customerName,
    customerId,
    note
  } = req.body;

  const check = new Checks({
    checkNo,
    amount,
    date,
    bankName,
    adress,
    accountOwner,
    refDoc,
    customerName,
    customerId,
    note,
    status: 1, //en caisse,versé, préavis, non payé, payé
    created,
    owner: req.user
  });

  try {
    const savedCheck = await check.save();
    res.send({
      success: true,
      check: savedCheck
    });
  } catch (e) {
    next(e);
  }
};

//destroy Check
checksController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Checks.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Check deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update Company
checksController.update = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  var updatedCheck = {};

  try {
    if ("checkNo" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            checkNo: body.checkNo,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("amount" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            amount: body.amount,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("date" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            date: body.date,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("bankName" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            bankName: body.bankName,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("adress" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            adress: body.adress,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("accountOwner" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            accountOwner: body.accountOwner,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("refDoc" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            refDoc: body.refDoc,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("customerName" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            customerName: body.customerName,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("customerId" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            customerId: body.customerId,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("note" in body) {
      updatedCheck = await Checks.updateOne(
        { _id: id },
        {
          $set: {
            note: body.note,

            lastUpdate: new Date()
          }
        }
      );
    }

    if (updatedCheck.ok === 1) {
      res.send({
        success: true
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = checksController;
