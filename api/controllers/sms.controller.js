const Nexmo = require("nexmo");

const smsController = {};

smsController.sendSMS = (req, res, next) => {
  const { number, textSMS } = req.body;

  const nexmo = new Nexmo({
    // apiKey: process.env.API_KEY,
    // apiSecret: process.env.API_SECRET
    apiKey: "d8a02560",
    apiSecret: "ugMyzGgjZGqhvs37"
  }); 

  console.log("req.body SMS:");
  console.log(req.body);
  const from = "COMIS_GoMyCode";
  const to = "21621003026";
  const text = textSMS;

  nexmo.message.sendSms(
    from,
    to,
    text,
    { type: "unicode" },
    (err, responseData) => {
      if (err) {
        console.log(err);
        res.send({ success: false, error: "Can't send SMS!" });
      } else {
        console.log(responseData);
        res.send({
          success: true,
          message: "SMS sent with success!",
          data: responseData
        });
      }
    }
  );
};

module.exports = smsController;
