var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var axios = require('axios');
var qs = require('qs');

const notificationController = {};

notificationController.codeVerificationEmail = async (req, res, next) => {
 
  const { codeEmail,candidatEmail } = req.body
   
      //----------------- send email ----------------------------

    var transporter = nodemailer.createTransport(smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "elearning.academy.tn@gmail.com",
        pass: "evsucuefcuapfezu" //google app password  
      }
    }));

    console.log("codeEmail",codeEmail)
    console.log("candidatEmail",candidatEmail)    


          var modifMailptions = {
        from: "elearning.academy.tn@gmail.com",
        to: candidatEmail,
        subject:"E-Learning Academy: Changement de mot de passe",
        html: ` <span>E-Learning Academy - webApp <br><h3> Le code de vérification est :</h3> <br><div style=" border: 1px solid blue; border-radius: 5px;padding:5px 7px 5px 7px;width:60px;height:24px;font-weight:bolder;font-size:18px">${codeEmail}<br></span>`
      };
      transporter.sendMail(modifMailptions, function (error, info) {
        if (error) {
          console.log("error email:", error);
          res.send({success:false, errorMessage: error }) 
        } else {  
          console.log("Email sent: " + info.response);
          res.send({success:true, SuccessResult: info.response })     
        }
      });

      
    //--------end email  ------------------

     
          
}

notificationController.codeVerificationTel = async (req, res, next) => {
 
  const { codeTel,candidatTel } = req.body
   
  
          // ---------------send SMS------------------------

     var data = qs.stringify({
      'grant_type': 'client_credentials'
    });
    var config = {
      method: 'post',
      url: 'https://api.orange.com/oauth/v3/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic VU5CMkdHV251aVBUZ1BIelczM2hBbEg0TEUwelo3WEk6NzVIYVpZdXMxakNlenljUQ=='
      },
      data: data
    };
    var accessToken;

    axios(config)
      .then(function (response) {
       // console.log(JSON.stringify(response.data));
        accessToken = response.data.access_token
        //console.log("global_accessToken:", JSON.stringify(accessToken));
        
        var data = JSON.stringify({
          "outboundSMSMessageRequest": {  
            "address": `tel:+216${candidatTel}`,
            "senderAddress": "tel:+21658241523",
            "outboundSMSTextMessage": { "message":` Association Voix et parole - webApp - Le code de vérification de votre email est :${codeTel}`},
            "senderName": "Association voix et parole - webApp"
          }
        });
      
      
        var config2 = {
          method: 'post',
          url: 'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B21658241523/requests',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
          },
          data: data
        };
   

   
        axios(config2)
          .then(function (response) {
           // console.log(JSON.stringify(response.data));
            console.log("SMS sent with success!");
           // res.send({ message: "Notification (app-email-sms) sent with success!" })
           //res.send({ successSendSMSVerif: true,message:response })  
          })
          .catch(function (error) {
            console.log("error1 SMS ==>",error);
            //res.send({ successSendSMSVerif: false,message:error })
          });

      })
      .catch(function (error) {
        console.log("error2 SMS ==>",error);
        res.send({ successSendSMSVerif: false,message:error })
      });
    //--------------end sms notif--------------------- 
    res.send({ success: true,message:"SMS sent with success!"})   
}



module.exports = notificationController;
