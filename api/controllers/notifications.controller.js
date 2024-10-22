const Nexmo = require("nexmo");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const Notification = require("../models/notification.model");
//const Appointment = require("../models/appointment.model");
//const Reminder = require("../models/reminder.model");
const Student = require("../models/students.model");
const Formation = require("../models/subDepartment.model");
const jwt = require("jsonwebtoken");
var CronJob = require('cron').CronJob;
var moment = require('moment');  
var axios = require('axios');
var qs = require('qs');
const {getIo} = require('../../index2');
const EventEmitter = require('events');
const { get } = require("./aboutController");
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();
// var options = {
//   method: 'POST',
//   url: 'https://YOUR_DOMAIN/oauth/token',
//   headers: {'content-type': 'application/x-www-form-urlencoded'},
//   data: {
//     grant_type: 'client_credentials',
//     client_id: 'YOUR_CLIENT_ID',
//     client_secret: 'YOUR_CLIENT_SECRET',
//     audience: 'YOUR_API_IDENTIFIER'
//   }
// };




const notificationController = {};

/*---------------Get notification by id-------------------*/
notificationController.getNotficationByReceiverId = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const notifications = await Notification.find({
      receiver_Id: _id
    });
    return res.send({
      success: true,
      notifications
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get notification by type-------------------*/
notificationController.getNotificationByType = async (req, res, next) => {
  const type = req.params.type;
  const currentUser_id = req.user._id;
  try {
    const notifications = await Notification.find({
      receiver_Id: currentUser_id,
      type
    });
    return res.send({
      success: true,
      notifications
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get notification by "important"-------------------*/
notificationController.getNotificationByImportance = async (req, res, next) => {
  const important = req.params.important;
  const currentUser_id = req.user._id;
  try {
    const notifications = await Notification.find({
      receiver_Id: currentUser_id,
      important
    });
    return res.send({
      success: true,
      notifications
    });
  } catch (e) {
    next(e);
  }
};

/*---------------Get all notifications-------------------*/
notificationController.getAllNotifications = async (req, res, next) => {
  const currentUser_id = req.user._id;
  try {
    const notifications = await Notification.find({
      receiver_Id: currentUser_id
    });
    return res.send({
      success: true,
      notifications
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get all notifications sorted by datetime limited (4)-------------------*/
notificationController.getAllNotificationsSortedByDateTimeAndLimited = async (
  req,
  res,
  next
) => {
  const currentUser_id = req.user._id;
  try {
    const notifications = await Notification.find({
      receiver_Id: currentUser_id
    })
      .sort({ _id: -1 })
      .limit(6);
    const notif = await Notification.find({
      receiver_Id: currentUser_id,
      readen: false
    });
    return res.send({
      success: true,
      nbNotifications: notif.length,
      notifications
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get all notifications by search text-------------------*/
notificationController.getAllNotificationsBySearchText = async (
  req,
  res,
  next
) => {
  const currentUser_id = req.user._id;
  const text = req.params.text;
  try {
    const notifications = await Notification.find(
      {
        receiver_Id: currentUser_id,
        $text: { $search: text }
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.send({
      notifications
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Create-------------------*/
notificationController.create = async (req, res, next) => {
  const { receiver_Id, note, important, type } = req.body;

  const newNotification = new Notification({
    receiver_Id,
    note,
    readen: false,
    important,
    type
  });

  try {
    const savedNotification = await newNotification.save();
    return res.send({
      success: true,
      notification: savedNotification
    });
  } catch (e) {
    next(e);
  }
};
// readen notifications
notificationController.setToReadenNotification = async (req, res, next) => {
  const id = req.params.id;

  try {
    const updatedNotification = await Notification.updateMany(
      { receiver_Id: id },
      {
        $set: {
          readen: true
        }
      }
    );
    res.send({
      success: true
    });
  } catch (e) {
    res.send({
      success: false
    });
    next(e);
  }
};

/*---------------Destroy-------------------*/
notificationController.destroy = async (req, res, next) => {
  const notification_id = req.params.id;

  try {
    await Notification.deleteOne({ _id: notification_id });
    return res.send({
      success: true,
      message: "Notification deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};







var createCronJob = (callback, time, app, io) => {
  //var jobId=app._id

  try {
    jobId = new CronJob(time, async function () {
      console.log('You will see this message every second');
      await callback()
      io.emit('notifications', app);
    }, null, true, 'America/Los_Angeles');

  } catch (e) {
    console.log('omg err', e);
  }

  jobId.start()


  // save in monogo and then reload client page
  return jobId
}
global.cronID;
global.cronID2

// notificationController.reminder = async (req, res, next) => {
//   const io = req.app.get('io');
//   const sockets = req.app.get('sockets');
//   const sessionId = req.app.get('sessionId');
//   const thisSocketId = sockets[sessionId];
//   const socketInstance = io.to(thisSocketId);
//  // const { app } = req.body
//  //console.log("app:", app)

//   // const { receiver_email, note, date, important, type } = app;
//   // console.log("jobId", receiver_email)

//   let date5 = new Date();

//   date5.setSeconds(date5.getSeconds() + 20);
//   date5.setSeconds(date5.getSeconds() + 10);
//   const job = new CronJob(date5, function () {
//     const d = new Date();
//     console.log('Specific date:', date5, ', onTick at:', d);
//   });
//   const job2 = new CronJob(date5, function () {
//     const d = new Date();
//     console.log('Specific date:', date5, ', onTick at:', d);
//   });
//   console.log('After job instantiation');

//   job.start();
//   job2.start();


//  // let cronId=createCronJob(()=>{console.log("hello cronjob func!!")},'*/3 * * * * *',false,app,io)
//   global.cronID=job
//   global.cronID2=job2
//   setTimeout(function(){ job.stop();
//   res.send({ message: "App2 notification sent with success!:"})   
//   }, 36000);

// }

//****************************************************************************************** */

global.timeouts = {};
global.index = 0;

notificationController.reminder = async (req, res, next) => {
  const io = req.app.get('io');
  // const sockets = req.app.get('sockets');
  // const sessionId = req.app.get('sessionId');
  // const thisSocketId = sockets[sessionId];
  // const socketInstance = io.to(thisSocketId);
  const { app } = req.body

  // console.log("app:", app)
  // //  let date = new Date();
  // // date.setSeconds(date.getSeconds()+2);
  const {  note, date, important, type,level } = app;
  //console.log("hello:",{ receiver_email, note,date, important, type })
  // //Run a job reminder immediately

  // in order to use it in application-notification
  //console.log("originalApp-type", originalApp)
  //console.log("note2", note2)


  setTimeout(async function () {
console.log("idFormation:",note&&note.idFormation)
    const formation = await Formation.findOne({_id:note.idFormation });//get users by level and role
    const listStudents=formation&&formation.students
    listStudents.forEach(async user => {
        const newNotification = new Notification({
            note: note,
            readen: false,
            created:new Date(),
            important,
            receiver_Id:user._id,
            type
          });
          const savedNotification = await newNotification.save();
    });
    
    
    console.log("Notif system saved!!")
    io.emit('notificationsStudents', app);


    //-------------------- end app notification ----------------------------


    //----------------- email notification ----------------------------

    var transporter = nodemailer.createTransport(smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "webapp.fmm@gmail.com",
        pass: "zmdmfiznmcjzovnt" //google app password  
      }
    }));

   

//     listUsers.forEach(async user => {


//     if (type === "notif-update") {

//       var modifMailptions = {
//         from: "webapp.fmm@gmail.com",
//         to: user.email,
//         subject: note.subject,
//         html: ` <span>${note.text} <br><u><h3> L'ancienne :</h3></u>Titre:<strong>${originalApp && originalApp.title}</strong><br>Le &nbsp;<strong>${originalApp && originalApp.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${originalApp && originalApp.location}</strong></span><br><u><h3>La nouvelle :</h3></u>Titre:<strong>${note.title}</strong> <br>Le &nbsp;<strong>${note.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${note.location}</strong></span>`
//       };
//       transporter.sendMail(modifMailptions, function (error, info) {
//         if (error) {
//           console.log("error email:", error);

//         } else {
//           console.log("Email sent: " + info.response);

//         }
//       });

//     } else {
//       var mailOptions = {
//         from: "webapp.fmm@gmail.com",
//         to: note.prof.email,
//         subject: note.subject,
//         html: ` <span>${note.text}  <br>Lien du cours:<br> &nbsp;<a href=\`${note.link}\`>Ouvrir la page</a></span>`
//       };
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log("error email:", error);

//         } else {
//           console.log("Email sent: " + info.response);

//         }
//       });
//     }
// });
    //--------end email notification ------------------

    // ---------------------- Send SMS ---------------------
    // ---------------send sms------------------------

    // var data = qs.stringify({
    //   'grant_type': 'client_credentials'
    // });
    // var config = {
    //   method: 'post',
    //   url: 'https://api.orange.com/oauth/v3/token',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': 'Basic VU5CMkdHV251aVBUZ1BIelczM2hBbEg0TEUwelo3WEk6cm5HaHhtQlF0SG1TODdIUw=='
    //   },
    //   data: data
    // };
    // var accessToken;

    // axios(config)
    //   .then(function (response) {
    //    // console.log(JSON.stringify(response.data));
    //     accessToken = response.data.access_token
    //     //console.log("global_accessToken:", JSON.stringify(accessToken));
    //     if (type === "agenda-update") {
    //     var data = JSON.stringify({
    //       "outboundSMSMessageRequest": {  
    //         "address": `tel:+216${note.prof&&note.prof.phone}`,
    //         "senderAddress": "tel:+21658241523",
    //         "outboundSMSTextMessage": { "message":` ${note.text} : (L'ancien=>), -${ originalApp && originalApp.title }- Le ${ originalApp && originalApp.startDate } à ${ originalApp && originalApp.location}, (Le nouveau =>) -${note.title}- Le ${ note.startDate } à ${ note.location}. Bonne journée.`},
    //         "senderName": "Administration FM Monastir"
    //       }
    //     });
    //   }else{
    //     var data = JSON.stringify({
    //       "outboundSMSMessageRequest": {
    //         "address": `tel:+216${note.prof&&note.prof.phone}`,
    //         "senderAddress": "tel:+21658241523",
    //         "outboundSMSTextMessage": { "message":"" + note.text +" , -" +note.title +"- Le " + note.startDate + " à "+ note.location+". Bonne journée." },
    //         "senderName": "Administration FM Monastir"
    //       }
    //     });
    //   }
    //     var config2 = {
    //       method: 'post',
    //       url: 'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B21658241523/requests',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + accessToken,
    //       },
    //       data: data
    //     };
   


      
    //     axios(config2)
    //       .then(function (response) {
    //        // console.log(JSON.stringify(response.data));
    //         console.log("Notification (app-email-sms) sent with success!");
    //        // res.send({ message: "Notification (app-email-sms) sent with success!" })
    //       })
    //       .catch(function (error) {
    //         console.log("error1 SMS ==>",error);
    //       });

    //   })
    //   .catch(function (error) {
    //     console.log("error2 SMS ==>",error);
    //   });
    //--------------end sms notif---------------------         
    res.send({ successNotification: true })

  }, date);

  //save idTimer (in order to use it to stop Reminder)
  //test if exist in db : delete it and create a new Reminder
  // if (date > 100000) { 
  //   console.log("new Date(note.startDate) /reminder",new Date(note.startDate))
  //   try {
  //     const newReminder = new Reminder({
  //       title:note.title,
  //       startDate:new Date(note.startDate),
  //       receiver_Id,
  //       idTimer: 'timeout-' + global.index,// setTimeout id

  //     });
  //     const savedReminder = await newReminder.save();
  //     console.log("savedReminder",savedReminder)
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   global.index++;
  // }
  // myEmitter.on('event', () => {
  //   console.log('an event occurred!');
  //   res.send({message:"Reminder stopped!"})
  // });
}

//------------------------------ cron-node ---------------------

// notificationController.CronReminder = async (io) => {

//   try{
//   var job = new CronJob('00 30 08 * * *', async function () {
//     const today = new Date()
//     const tomorrow = new Date(today)

//     tomorrow.setDate(tomorrow.getDate() + 1)
//     tomorrow.getDate()
//     tomorrow.getMonth()//getMonth() start from 0 so to get right month we have to add 1
//     tomorrow.getFullYear()
//     //console.log("Demain Le :",tomorrow.getDate()+"/"+tomorrow.getMonth()+"/"+tomorrow.getFullYear());
//     //--------------------- Get appointment of tomorrow --------------//
//     const list = await Appointment.find();
//     let filtredList = list.filter((el) => (new Date(el.startDate).getDate() == tomorrow.getDate()) && (new Date(el.startDate).getMonth() == tomorrow.getMonth()) && (new Date(el.startDate).getFullYear() == tomorrow.getFullYear()) )//&& (el.createdBy=='Administrateur')
//     if (filtredList.length > 0)
//       for (el of filtredList) {

//         console.log("ok pour:", el.prof && el.prof.name)
//         const newNotification = new Notification({
//           note: el,
//           readen: false,
//           important:true,
//           receiver_Id:el.prof && el.prof.id,
//           type:"lastNotif"
//         });
//         const savedNotification = await newNotification.save();
//         console.log("Notif system saved!!")
//         io.emit('notifications', el);


//         //-------------------- end app notification ----------------------------


        
//     //----------------- email notification ----------------------------

//     var transporter = nodemailer.createTransport(smtpTransport({
//         service: "gmail",
//         host: "smtp.gmail.com",
//         auth: {
//           user: "webapp.fmm@gmail.com",
//           pass: "zmdmfiznmcjzovnt" //google app password  
//         }
//       }));
  
//       //const foundUser = await User.findOne({ _id: receiver.id });
//       //  function getMailOptions(){
//       //     if(type==="agenda-update"){
  
//       //      // console.log("originalApp",originalApp)
//       //       return {
//       //         from: "anouar.chikh@gmail.com",
//       //         to: note.prof.email,
//       //         subject: note.title,
//       //         html: ` <span>${originalApp.note.text} :<br><strong> <<L'ancien>>:</strong><br><br>Le &nbsp;<strong>${originalApp.note.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${originalApp.note.location}</strong></span><br><strong>Le nouveau :</strong> <br>Le &nbsp;<strong>${note.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${note.location}</strong></span>`
//       //       };
//       //     }else{
//       //       return {
//       //         from: "anouar.chikh@gmail.com",
//       //         to: note.prof.email,
//       //         subject: note.title,
//       //         html: ` <span>${note.text} :<br>Titre:<strong>${note.title}</strong>  <br>Le &nbsp;<strong>${note.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${note.location}</strong></span>`
//       //       };
//       //     }
//       //   }
  
  
  
  
  
//       if (type === "agenda-update") {
  
//         var modifMailptions = {
//           from: "webapp.fmm@gmail.com",
//           to: note.prof.email,
//           subject: note.subject,
//           html: ` <span>${note.text} <br><u><h3> L'ancienne :</h3></u>Titre:<strong>${originalApp && originalApp.title}</strong><br>Le &nbsp;<strong>${originalApp && originalApp.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${originalApp && originalApp.location}</strong></span><br><u><h3>La nouvelle :</h3></u>Titre:<strong>${note.title}</strong> <br>Le &nbsp;<strong>${note.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${note.location}</strong></span>`
//         };
//         transporter.sendMail(modifMailptions, function (error, info) {
//           if (error) {
//             console.log("error email:", error);
  
//           } else {
//             console.log("Email sent: " + info.response);
  
//           }
//         });
  
//       } else {
//         var mailOptions = {
//           from: "webapp.fmm@gmail.com",
//           to: note.prof.email,
//           subject: note.subject,
//           html: ` <span>${note.text} <br>Titre:<strong>${note.title}</strong>  <br>Le &nbsp;<strong>${note.startDate}</strong>&nbsp;<br>à &nbsp;<strong>${note.location}</strong></span>`
//         };
//         transporter.sendMail(mailOptions, function (error, info) {
//           if (error) {
//             console.log("error email:", error);
  
//           } else {
//             console.log("Email sent: " + info.response);
  
//           }
//         });
//       }
//       //--------end email notification ------------------
  
//       // ---------------------- Send SMS ---------------------
//       // ---------------send sms------------------------
  
//       var data = qs.stringify({
//         'grant_type': 'client_credentials'
//       });
//       var config = {
//         method: 'post',
//         url: 'https://api.orange.com/oauth/v3/token',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': 'Basic VU5CMkdHV251aVBUZ1BIelczM2hBbEg0TEUwelo3WEk6cm5HaHhtQlF0SG1TODdIUw=='
//         },
//         data: data
//       };
//       var accessToken;
  
//       axios(config)
//         .then(function (response) {
//          // console.log(JSON.stringify(response.data));
//           accessToken = response.data.access_token
//           //console.log("global_accessToken:", JSON.stringify(accessToken));
//           if (type === "agenda-update") {
//           var data = JSON.stringify({
//             "outboundSMSMessageRequest": {  
//               "address": `tel:+216${note.prof&&note.prof.phone}`,
//               "senderAddress": "tel:+21658241523",
//               "outboundSMSTextMessage": { "message":` ${note.text} : (L'ancien=>), -${ originalApp && originalApp.title }- Le ${ originalApp && originalApp.startDate } à ${ originalApp && originalApp.location}, (Le nouveau =>) -${note.title}- Le ${ note.startDate } à ${ note.location}. Bonne journée.`},
//               "senderName": "Administration FM Monastir"
//             }
//           });
//         }else{
//           var data = JSON.stringify({
//             "outboundSMSMessageRequest": {
//               "address": `tel:+216${note.prof&&note.prof.phone}`,
//               "senderAddress": "tel:+21658241523",
//               "outboundSMSTextMessage": { "message":"" + note.text +" , -" +note.title +"- Le " + note.startDate + " à "+ note.location+". Bonne journée." },
//               "senderName": "Administration FM Monastir"
//             }
//           });
//         }
//           var config2 = {
//             method: 'post',
//             url: 'https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B21658241523/requests',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': 'Bearer ' + accessToken,
//             },
//             data: data
//           };
     
  
  
        
//           axios(config2)
//             .then(function (response) {
//              // console.log(JSON.stringify(response.data));
//               console.log("Notification (app-email-sms) sent with success!");
//              // res.send({ message: "Notification (app-email-sms) sent with success!" })
//             })
//             .catch(function (error) {
//               console.log("error1 SMS ==>",error);
//             });
  
//         })
//         .catch(function (error) {
//           console.log("error2 SMS ==>",error);
//         });
//       //--------------end sms notif---------------------
//       }
//     else {
//       console.log("No apps for tomorrow!")
//     }


//   }, null, true, 'Africa/Tunis');
//   job.start();
// }catch (e) {
//   console.log(e);
// }
// }



//-----------------------------------------------------------------------------------------------------
notificationController.StopReminder = async (req, res, next) => {
  //console.log("global.cronID:",global.cronID)
  //global.cronID1.stop()
  // const { note, receiver_Id, } = req.body
  // console.log('new Date(note.startDate):', new Date(note.startDate))
  // clearTimeout(global.timeouts['timeout-0'])
  // myEmitter.emit('event');
  // try {
  //   console.log("note-(stop)", note)
  //   const foundReminder = await Reminder.findOne({
  //     title: note.title,
  //     startDate: new Date(note.startDate),
  //     receiver_Id: note.prof.id,
  //   });
  //   if (foundReminder) {
  //     var jobIndex = foundReminder.idTimer;
  //     clearTimeout(global.timeouts[jobIndex]);
  //     global.timeouts[jobIndex] = undefined;
  //     res.send({ success: true, message: "App notification stopped!!", stoppedReminder: foundReminder })
  //   } else {
  //     res.send({ success: false, message: "Job-Reminder not found !", stoppedReminder: foundReminder })
  //   }
  // } catch (e) {
  //   console.log(e);
  // }
}

notificationController.watchCollectionChanges=async ()=> {
  try {
     const ioG=get()
    // Open a change stream on the collection
    const changeStream = Notification.watch();

    // Listen for change events
    changeStream.on('change', (change) => {
     // console.log('Change event:', change);
      // Handle the change event here
      ioG.emit('refresh');
    });

  } catch (error) {
    console.error('Error:', error);
  }
}



module.exports = notificationController;
