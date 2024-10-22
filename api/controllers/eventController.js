const Event = require("../models/event.model");
const Program=require("../models/program.model")
const EventController = {};

//get all events
EventController.getAllEvents = async (req, res, next) => {
  const user = req.user;
 
  try {
    const events = await Event.find();
    res.send({ events });
    // if (events.length > 0) {
    //   res.send({ events });
    // } else {
    //   res.status(401);
    //   res.send({ error: "No Events!" });
    // }
  } catch (e) {

    next(e);
  }
};
//get all events
EventController.getAllEventsHome = async (req, res, next) => {
  const user = req.user;
 
  try {
    const events = await Event.find({"showIn":"true"}).sort( { "order": 1 } );
    res.send({ events });
    // if (events.length > 0) {
    //   res.send({ events });
    // } else {
    //   res.status(401);
    //   res.send({ error: "No Events!" });
    // }
  } catch (e) {

    next(e);
  }
};

//get events by date periode
EventController.getEventsByDate = async (req, res, next) => {
  const user = req.user;
  const query = {
    user: user._id
  };
  try {
    const events = await Event.find();
    res.send({ events });
    // if (events.length > 0) {
    //   res.send({ events });
    // } else {
    //   res.status(401);
    //   res.send({ error: "No Events!" });
    // }
  } catch (e) {

    next(e);
  }
};

// //get all program of doc
// EventController.getProgramByEventId = async (req, res, next) => {
//   const id = req.params.id;

//   try {
//     const ds = await Event.aggregate([
//       // Do the lookup matching
//       { $match: { _id:id } },
//       // Unwind the source
//       { $unwind: "$program" },

//       {
//         $lookup: {
//           from: "program",
//           localField: "program",
//           foreignField: "_id",
//           as: "items"
//         }
//       },

//       // Unwind the result arrays ( likely one or none )
//       { $unwind: "$items" },
//       // Group back to arrays
//       {
//         $group: {
//           _id: "$_id",
//           properties: {
//             //get general prperties of this doc
//             $first: {
//               //just first item
             
//             }
//           },

//           items: {
//             //get detailes of doc
//             $push: {
//               _id: "$items._id",
//               eventId:"$items.id",
//               date:"$items.date",
//               timeStart:"$items.timeStart",
//               timeEnd:"$items.timeEnd",
//               descAr: "$items.descAr",
//               descFr: "$items.descFr",
//               descrEn:"$items.descrEn",
//               files:"$items.files"
              
//             }
//           }
//         }
//       }
//     ]);
//     if (Object.keys(ds).length > 0) res.send({ doc: ds[0] });
//     else res.send({ doc: { items: undefined } });
//   } catch (e) {
//     res.status(401);
//     res.send({ error: "No details" });
//     next(e);
//   }
// };

// Get Event by Id

EventController.getEventById = async (req, res, next) => {
  const id = req.params.id;
  
  try {
    const foundEvent = await Event.findOne({
      _id: id
        });

    if (foundEvent) {
      res.send({ event: foundEvent });
    } else {
      res.status(401);
      res.send({
        error: `Cette évenement n'existe pas!.`
      });
    }
  } catch (e) {
    next(e);
  }
};

//create Event
EventController.create = async (req, res, next) => {
  const {
    dateEnd,
    dateStart,
    category,
    selectGov,
    selectCity,
    placeAr,
    placeFr,
    placeEn,
titleAr,
  titleFr,
  titleEn,
  descAr,
  descFr,
  descEn,
  showIn,
  image,
  } = req.body;
  const newEvent = new Event({
  dateEnd,
  dateStart,
    category,
    selectGov,
    selectCity,
    placeAr,
    placeFr,
    placeEn,
  titleAr,
  titleFr,
  titleEn,
  descAr,
  descFr,
  descEn,
  showIn,
  image,
   user: req.user
  });

  try {
    const savedEvent = await newEvent.save();
    res.send({
      success: true,
      savedEvent
    });
  } catch (e) {
    next(e);
  }
};

//destroy event
EventController.delete = async (req, res, next) => {
  const id = req.params.id;

  try {

    await Program.deleteMany({idEvent:id});
    await Event.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Event deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update Event

// patch event
EventController.patch= async (req, res, next) => {
  let body = req.body;
  const id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedEvent = await Event.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedEvent
    });
  } catch (e) {
    next(e);
  }
};
EventController.addProgram = async (req, res, next) => {
  const body = req.body;
  const ref = req.params.ref;
  var updatedEvent = {};
  
  try {
    updatedEvent = await Event.updateOne(
      { _id: ref },
      {
        $set: {
          lastUpdate: new Date()
        },
        $push: { program: body.idProgram }
      }
    );

    
    /// send response
    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

EventController.deleteProgramFromEvent = async (req, res, next) => {
  const body = req.body;
  const ref = req.params.idEvent;
  var updatedEvent = {};
  console.log("body:", body);
  try {
    updatedEvent = await Event.updateOne(
      { idEvent: ref },
      {
        $set: {
          lastUpdate: new Date()
        },
        $pull: { program: body.idProgram }
        // multi: true
      }
    );

    res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

// /*---------------Get all Events by search text-------------------*/
// SaleDocController.getAllSaleDocsBySearchText = async (req, res, next) => {
//   const currentUser_id = req.user._id;
//   const text = req.params.text;
//   try {
//     const SaleDocs = await SaleDoc.find(
//       {
//         owner: currentUser_id,
//         $text: { $search: text }
//       },
//       { score: { $meta: "textScore" } }
//     ).sort({ score: { $meta: "textScore" } });

//     return res.send({
//       SaleDocs
//     });
//   } catch (e) {
//     next(e);
//   }
// };

// SaleDocController.updateAmount = async function updateTotalAmount(ref) {
//   const doc = await SaleDoc.find({ refdoc: ref });
//   if (doc[0].details.length > 0) {
//     const doc = await SaleDoc.aggregate([
//       // Do the lookup matching
//       { $match: { refdoc: ref } },
//       // Unwind the source
//       { $unwind: "$details" },
//       {
//         $lookup: {
//           from: "detailsdocs",
//           localField: "details",
//           foreignField: "_id",
//           as: "items"
//         }
//       },
//       // Unwind the result arrays ( likely one or none )
//       { $unwind: "$items" },
//       // Group back to arrays
//       {
//         $group: {
//           _id: "$_id",
//           details: { $push: "$details" },
//           items: {
//             $push: {
//               description: "$items.description",
//               quantity: "$items.quantity",
//               unite: "$items.unite",
//               price: "$items.price",
//               rem: "$items.rem",
//               mHt: {
//                 $sum: { $multiply: ["$items.price", "$items.quantity"] }
//               }
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           total: { $sum: "$items.mHt" }
//         }
//       }
//     ]);

//     await SaleDoc.updateOne(
//       { refdoc: ref },
//       {
//         $set: {
//           subTotal: doc[0].total,

//           lastUpdate: new Date()
//         }
//       }
//     );
//   } else {
//     await SaleDoc.updateOne(
//       { refdoc: ref },
//       {
//         $set: {
//           subTotal: 0,

//           lastUpdate: new Date()
//         }
//       }
//     );
//   }
// };

module.exports = EventController;
