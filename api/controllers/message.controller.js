const Message = require("../models/message.model");
const jwt = require("jsonwebtoken");
const messageController = {};

/*---------------Get all Messages sorted by datetime limited (4)-------------------*/
messageController.getAllMessagesSortedByDateTimeAndLimited = async (
  req,
  res,
  next
) => {
  const currentUser_id = req.user._id;
  try {
    const Messages = await Message.find({
      receiver_Id: currentUser_id
    })
      .sort({ created: 1 })
      .limit(4);
    return res.send({
      Messages
    });
  } catch (e) {
    next(e);
  }
};

/*---------------Get message by sender -------------------*/
messageController.getMessagesBySender = async (req, res, next) => {
  const senderID = req.params.id;
  const currentUser_id = req.user._id;

  try {
    const Messages = await Message.find({
      sender_Id: senderID,
      receiver_Id: currentUser_id
    });
    return res.send({
      Messages
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get message by sender -------------------*/
messageController.getMessagesBySentByCurrentUser = async (req, res, next) => {
  const senderID = req.user._id;

  try {
    const Messages = await Message.find({
      sender_Id: senderID
    });
    return res.send({
      Messages
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get all messages -------------------*/
messageController.getAllMessages = async (req, res, next) => {
  const currentUser_id = req.user._id;

  try {
    const Messages = await Message.find({
      receiver_Id: currentUser_id
    });
    return res.send({
      Messages
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get Messages by Id-------------------*/
messageController.getMessagesById = async (req, res, next) => {
  const messageID = req.params._id;
  try {
    const Message = await Message.find({ _id: messageID });
    return res.send({
      message: Message
    });
  } catch (e) {
    next(e);
  }
};

/*---------------Create (send)-------------------*/
messageController.sendMessage = async (req, res, next) => {
  const { content, receiver_Id } = req.body;

  const sender_Id = req.user._id;

  const newMessage = new Message({
    content,
    recycleBin: false,
    readen: false,
    sender_Id,
    receiver_Id
  });

  try {
    const savedMessage = await newMessage.save();
    return res.send({
      success: true,
      Message: savedMessage
    });
  } catch (e) {
    next(e);
  }
};
// Recycle Bin
messageController.sendToRecycleBin = async (req, res, next) => {
  const id = req.params.id;

  try {
    const updatedMessage = await Message.updateOne(
      { _id: id },
      {
        $set: {
          recycleBin: true,

          lastUpdate: new Date()
        }
      }
    );
    return res.send({
      success: true,
      updatedMessage
    });
  } catch (e) {
    next(e);
  }
};

// readen message
messageController.setToReadenMessage = async (req, res, next) => {
  const id = req.params.id;

  try {
    const updatedMessage = await Message.updateOne(
      { _id: id },
      {
        $set: {
          readen: true,

          lastUpdate: new Date()
        }
      }
    );
    return res.send({
      success: true,
      updatedMessage
    });
  } catch (e) {
    next(e);
  }
};

/*---------------Destroy-------------------*/
messageController.destroy = async (req, res, next) => {
  const Message_id = req.params.id;

  try {
    await Message.deleteOne({ _id: Message_id });
    return res.send({
      success: true,
      message: "Message deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

module.exports = messageController;
