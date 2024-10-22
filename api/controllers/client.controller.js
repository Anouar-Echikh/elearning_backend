const Client = require("../models/client.model");

const clientController = {};

//get all clients
clientController.getAllClients = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const clients = await Client.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user"
        }
      }
    ]);
    if (clients.length > 0) {
      res.send({ clients });
    }
  } catch (e) {
    res.status(401);
    res.send({ error: "No clients" });
    next(e);
  }
};

// Get client by Id

clientController.getClientById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundClient = await Client.findOne({
      _id: id
    });

    if (foundClient) {
      res.send({ client: foundClient });
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

// Get client by n° account

clientController.getClientByNumAccount = async (req, res, next) => {
  const num = req.params.numAccount;
  try {
    const foundClient = await Client.findOne({
      nAccount: num
    });

    if (foundClient) {
      res.send({ client: foundClient });
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

//create client
clientController.create = async (req, res, next) => {
  const {
    nAccount,
    name,
    quality,
    refClient,
    phone,
    email,
    region,
    adress,
    zipCode,
    type,
    note
  } = req.body;
  const newClient = new Client({
    nAccount,
    name,
    quality,
    refClient,
    phone,
    email,
    region,
    adress,
    zipCode,
    type,
    note,
    owner: req.user
  });

  try {
    const savedClient = await newClient.save();
    res.send({
      success: true,
      client: savedClient
    });
  } catch (e) {
    next(e);
  }
};

//destroy client
clientController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Client.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "client deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update client
clientController.update = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  var updatedClient = {};
  try {
    if ("name" in body) {
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
        { _id: id },
        {
          $set: {
            quality: body.quality,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("refClient" in body) {
      updatedClient = await Client.updateOne(
        { _id: id },
        {
          $set: {
            refClient: body.refClient,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("phone" in body) {
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
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
      updatedClient = await Client.updateOne(
        { _id: id },
        {
          $set: {
            quality: body.quality,
            lastUpdate: new Date()
          }
        }
      );
    }

    if (updatedClient.ok === 1) {
      res.send({
        success: true
      });
    } else {
      res.send({
        success: false,
        updatedClient,
        error: "Problème de mise à jour client"
      });
    }
  } catch (e) {
    console.log("updatedClient:", updatedClient);
    next(e);
  }
};

/*---------------Get all Clients by search text-------------------*/
clientController.getAllClientsBySearchText = async (req, res, next) => {
  const text = req.params.text;
  try {
    const Clients = await Client.find(
      {
        $text: { $search: text }
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.send({
      Clients
    });
  } catch (e) {
    next(e);
  }
};
module.exports = clientController;
