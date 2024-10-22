const SaleDoc = require("../models/saleDoc.model");

const SaleDocController = {};

//get all SaleDocs for all users
SaleDocController.getAllSaleDocs = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const SaleDocs = await SaleDoc.find();
    if (SaleDocs.length > 0) {
      res.send({ SaleDocs });
    } else {
      res.status(401);
      res.send({ error: "No SaleDocs for you" });
    }
  } catch (e) {
    next(e);
  }
};
//get all SaleDocs for current user
SaleDocController.getAllSaleDocsCurrentUser = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const SaleDocs = await SaleDoc.find({ query });
    if (SaleDocs.length > 0) {
      res.send({ SaleDocs });
    } else {
      res.status(401);
      res.send({ error: "No SaleDocs for you" });
    }
  } catch (e) {
    next(e);
  }
};

//get all details of doc
SaleDocController.getSaleDocByRef = async (req, res, next) => {
  const ref = req.params.ref;

  try {
    const ds = await SaleDoc.aggregate([
      // Do the lookup matching
      { $match: { refdoc: ref } },
      // Unwind the source
      { $unwind: "$details" },

      {
        $lookup: {
          from: "detailsdocs",
          localField: "details",
          foreignField: "_id",
          as: "items"
        }
      },

      // Unwind the result arrays ( likely one or none )
      { $unwind: "$items" },
      // Group back to arrays
      {
        $group: {
          _id: "$_id",
          properties: {
            //get general prperties of this doc
            $first: {
              //just first item
              refdoc: "$refdoc",
              type: "$type",
              date: "$date",
              customerId: "$customerId",
              name: "$name",
              adress: "$adress",
              unite: "$unite",
              phone: "$phone",
              subTotal: "$subTotal",
              note: "$note",
              created: "$created",
              lastUpdate: "$lastUpdate"
            }
          },

          items: {
            //get detailes of doc
            $push: {
              idDetail: "$items._id",
              docId: "$items.docId",
              idProduct: "$items.product",
              description: "$items.description",
              quantity: "$items.quantity",
              unite: "$items.unite",
              price: "$items.price",
              rem: "$items.rem",
              mHt: {
                $sum: [{ $multiply: ["$items.price", "$items.quantity"] }]
              }
            }
          }
        }
      }
    ]);
    if (Object.keys(ds).length > 0) res.send({ doc: ds[0] });
    else res.send({ doc: { items: undefined } });
  } catch (e) {
    res.status(401);
    res.send({ error: "No details" });
    next(e);
  }
};
// Get SaleDoc by Id

SaleDocController.getSaleDocById = async (req, res, next) => {
  const id = req.params.id;
  const query = {
    owner: user._id
  };
  try {
    const foundSaleDoc = await SaleDoc.findOne({
      _id: id,
      query
    });

    if (foundSaleDoc) {
      res.send({ SaleDoc: foundSaleDoc });
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
// Get last SaleDoc by type SaleDoc

SaleDocController.getLastSaleDocByType = async (req, res, next) => {
  const type = req.params.type;

  try {
    const foundSaleDoc = await SaleDoc.find({
      type
    })
      .sort({ _id: -1 })
      .limit(1);

    if (foundSaleDoc) {
      res.send({ saleDoc: foundSaleDoc[0] });
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

// Get SaleDoc by type SaleDoc

SaleDocController.getSaleDocsByType = async (req, res, next) => {
  const type = req.params.type;
  const query = {
    owner: user._id
  };
  try {
    const foundSaleDocs = await SaleDoc.findOne({
      type,
      query
    });

    if (foundSaleDoc) {
      res.send({ saleDocs: foundSaleDocs });
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

// Get SaleDoc by customer id

SaleDocController.getSaleDocByCustomerId = async (req, res, next) => {
  const id = req.params.id;
  const query = {
    owner: user._id
  };
  try {
    const foundSaleDocs = await SaleDoc.findOne({
      _id: id
    });

    if (foundSaleDoc) {
      res.send({ SaleDocs: foundSaleDocs });
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
//create SaleDoc
SaleDocController.create = async (req, res, next) => {
  const {
    refdoc,
    type,
    date,
    name,
    adress,
    phone,
    customerId,
    note
  } = req.body;
  const newSaleDoc = new SaleDoc({
    refdoc,
    type,
    date,
    name,
    adress,
    phone,
    customerId,
    note,
    owner: req.user
  });

  try {
    const savedSaleDoc = await newSaleDoc.save();
    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

//destroy SaleDoc
SaleDocController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await SaleDoc.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "SaleDoc deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update SaleDoc
SaleDocController.update = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  var updatedSaleDoc = {};

  try {
    if ("type" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            type: body.type,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("date" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            date: body.date,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("customerId" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            customerId: body.customerId,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("name" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            name: body.name,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("adress" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            adress: body.adress,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("phone" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            phone: body.phone,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("subTotal" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            subTotal: body.subTotal,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("note" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            note: body.note,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("initCountRef" in body) {
      updatedSaleDoc = await SaleDoc.updateOne(
        { _id: id },
        {
          $set: {
            initCountRef: body.initCountRef,

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

SaleDocController.addDetailsToDoc = async (req, res, next) => {
  const body = req.body;
  const ref = req.params.ref;
  var updatedSaleDoc = {};
  console.log("body:", body);
  try {
    updatedSaleDoc = await SaleDoc.updateOne(
      { refdoc: ref },
      {
        $set: {
          lastUpdate: new Date()
        },
        $push: { details: body.idDetail }
      }
    );

    //update amount doc
    await module.exports.updateAmount(ref);
    /// send response
    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

SaleDocController.deleteDetailsFromDoc = async (req, res, next) => {
  const body = req.body;
  const ref = req.params.ref;
  var updatedSaleDoc = {};
  console.log("body:", body);
  try {
    updatedSaleDoc = await SaleDoc.updateOne(
      { refdoc: ref },
      {
        $set: {
          lastUpdate: new Date()
        },
        $pull: { details: body.idDetail }
        // multi: true
      }
    );

    //update amount doc
    await module.exports.updateAmount(ref);
    /// send response

    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

/*---------------Get all SaleDocs by search text-------------------*/
SaleDocController.getAllSaleDocsBySearchText = async (req, res, next) => {
  const currentUser_id = req.user._id;
  const text = req.params.text;
  try {
    const SaleDocs = await SaleDoc.find(
      {
        owner: currentUser_id,
        $text: { $search: text }
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.send({
      SaleDocs
    });
  } catch (e) {
    next(e);
  }
};

SaleDocController.updateAmount = async function updateTotalAmount(ref) {
  const doc = await SaleDoc.find({ refdoc: ref });
  if (doc[0].details.length > 0) {
    const doc = await SaleDoc.aggregate([
      // Do the lookup matching
      { $match: { refdoc: ref } },
      // Unwind the source
      { $unwind: "$details" },
      {
        $lookup: {
          from: "detailsdocs",
          localField: "details",
          foreignField: "_id",
          as: "items"
        }
      },
      // Unwind the result arrays ( likely one or none )
      { $unwind: "$items" },
      // Group back to arrays
      {
        $group: {
          _id: "$_id",
          details: { $push: "$details" },
          items: {
            $push: {
              description: "$items.description",
              quantity: "$items.quantity",
              unite: "$items.unite",
              price: "$items.price",
              rem: "$items.rem",
              mHt: {
                $sum: { $multiply: ["$items.price", "$items.quantity"] }
              }
            }
          }
        }
      },
      {
        $project: {
          total: { $sum: "$items.mHt" }
        }
      }
    ]);

    await SaleDoc.updateOne(
      { refdoc: ref },
      {
        $set: {
          subTotal: doc[0].total,

          lastUpdate: new Date()
        }
      }
    );
  } else {
    await SaleDoc.updateOne(
      { refdoc: ref },
      {
        $set: {
          subTotal: 0,

          lastUpdate: new Date()
        }
      }
    );
  }
};

module.exports = SaleDocController;
