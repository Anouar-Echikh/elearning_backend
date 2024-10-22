const Payement = require("../models/payement.model");

const payementController = {};

//get all payements
payementController.getAllPayements = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const payements = await Payement.find();
    if (payements.length > 0) {
      res.send({ payements });
    } else {
      res.status(401);
      res.send({ error: "No payements" });
    }
  } catch (e) {
    next(e);
  }
};

// Get payement by Id

payementController.getPayementById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundPayement = await Payement.findOne({
      _id: id
    });

    if (foundPayement) {
      res.send({ payement: foundPayement });
    } else {
      res.status(401);
      res.send({
        error: `Ce payement n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get payement by ref doc

payementController.getpayementByRefDoc = async (req, res, next) => {
  const num = req.params.ref;
  try {
    const payements = await Payement.find({
      refDoc: ref
    });

    if (payements.length > 0) {
      res.send({ payements });
    } else {
      res.status(401);
      res.send({
        error: `Il n'existe pas de payements.`
      });
    }
  } catch (e) {
    next(e);
  }
};

//create payement
payementController.create = async (req, res, next) => {
  const { code, refDoc, customerName, customerId, mtEsp, mtChq } = req.body;

  const newPayement = new payement({
    code,
    refDoc,
    customerName,
    customerId,
    mtEsp,
    mtChq,
    validated: false,
    owner: req.user
  });

  try {
    const savedpayement = await newPayement.save();
    res.send({
      success: true,
      payement: savedpayement
    });
  } catch (e) {
    next(e);
  }
};

//destroy payement
payementController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Payement.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Payement deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};
//get all payements of doc
payementController.getPayementByRef = async (req, res, next) => {
  const idPay = req.params.idPay;

  try {
    const ds = await Payement.aggregate([
      // Do the lookup matching
      { $match: { _id: idPay } },
      // Unwind the source
      { $unwind: "$checks" },

      {
        $lookup: {
          from: "checks",
          localField: "checks",
          foreignField: "_id",
          as: "checks"
        }
      },

      // Unwind the result arrays ( likely one or none )
      { $unwind: "$checks" },
      // Group back to arrays
      {
        $group: {
          _id: "$_id",
          properties: {
            //get general prperties of this doc
            $first: {
              //just first item
              refDoc: "$refDoc",
              customerName: "$customerName",
              customerId: "$customerId",
              mtEsp: "$mtEsp",
              mtChq: "$mtChq",
              created: "$created",
              lastUpdate: "$lastUpdate",
              validated: "$validated",
              owner: "$owner"
            },

            checks: {
              //get detailes of doc
              $push: {
                amount: "$checks.amount",
                date: "$checks.date",
                bankName: "$checks.bankName",
                adress: "$checks.adress",
                note: "$checks.note",
                status: "$checks.status"
              }
            }
          }
        }
      }
    ]);
    if (Object.keys(ds).length > 0) res.send({ doc: ds[0] });
    else res.send({ payement: { checks: undefined } });
  } catch (e) {
    res.status(401);
    res.send({ error: "No payements" });
    next(e);
  }
};

// update payement
payementController.update = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  var updatedPayement = {};

  try {
    if ("refDoc" in body) {
      updatedPayement = await Payement.updateOne(
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
      updatedPayement = await Payement.updateOne(
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
      updatedPayement = await Payement.updateOne(
        { _id: id },
        {
          $set: {
            customerId: body.customerId,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("mtEsp" in body) {
      updatedPayement = await Payement.updateOne(
        { _id: id },
        {
          $set: {
            mtEsp: body.mtEsp,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("mtChq" in body) {
      updatedPayement = await Payement.updateOne(
        { _id: id },
        {
          $set: {
            mtChq: body.mtChq,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("validated" in body) {
      updatedPayement = await Payement.updateOne(
        { _id: id },
        {
          $set: {
            validated: body.validated,

            lastUpdate: new Date()
          }
        }
      );
    }

    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

payementController.addCheckToPayement = async (req, res, next) => {
  const body = req.body;
  const idPay = req.params.idPay;
  var updatedPayement = {};

  try {
    updatedPayement = await Payement.updateOne(
      { _id: idPay },
      {
        $set: {
          lastUpdate: new Date()
        },
        checks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Checks" }],
        $push: { checks: body.idCheck }
      }
    );

    //update amount doc
    await module.exports.updateAmountChecks(idPay);
    /// send response
    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

payementController.deleteChecksFromPayement = async (req, res, next) => {
  const body = req.body;
  const idPay = req.params.idPay;
  var updatedPayement = {};
  console.log("body:", body);
  try {
    updatedSaleDoc = await SaleDoc.updateOne(
      { _id: idPay },
      {
        $set: {
          lastUpdate: new Date()
        },
        $pull: { checks: body.idCheck }
        // multi: true
      }
    );

    //update amount doc
    await module.exports.updateAmountChecks(idPay);
    /// send response

    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

payementController.updateAmountChecks = async function updateTotalAmount(
  idPay
) {
  const pay = await Payement.find({ _id: idPay });
  if (pay[0].checks.length > 0) {
    const pay = await Payement.aggregate([
      // Do the lookup matching
      { $match: { _id: idPay } },
      // Unwind the source
      { $unwind: "$checks" },
      {
        $lookup: {
          from: "payement",
          localField: "checks",
          foreignField: "_id",
          as: "checks"
        }
      },
      // Unwind the result arrays ( likely one or none )
      { $unwind: "$checks" },
      // Group back to arrays
      {
        $group: {
          _id: "$_id",
          checks: { $push: "$checks" },
          items: {
            $push: {
              amount: "$checks.amount",
              date: "$checks.date",
              bankName: "$checks.bankName",
              adress: "$checks.adress",
              note: "$checks.note",
              status: "$checks.status"
            }
          }
        }
      },
      {
        $project: {
          total: { $sum: "$checks.amount" }
        }
      }
    ]);

    await Payement.updateOne(
      { _id: idPay },
      {
        $set: {
          mtChq: pay[0].total,

          lastUpdate: new Date()
        }
      }
    );
  } else {
    await Payement.updateOne(
      { _id: idPay },
      {
        $set: {
          mtChq: 0,

          lastUpdate: new Date()
        }
      }
    );
  }
};

module.exports = payementController;
