const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const path = require("path");
const app = express();
const router = require("./routes/router");
var session = require('express-session')
const tus = require('tus-node-server');
const fs = require ("fs")
const cors = require("cors");
var useragent = require("express-useragent");

const Notification = require('./models/notification.model'); 

//--------------- DB config ---------------//
mongoose.connect(process.env.MONGO_DB_URI, {  
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.on("connected", () => {
  console.log("Database connected with sucess !");
  // activer le watcher in notifications --------

//---------------------------------------------
});
mongoose.connection.on("error", err => {
  console.error("Database connexion failed !" + err);
});

//--------------- Middlewares ------------//
//path to index.html (configuration jlastic)
//app.use(express.static(path.join(__dirname + "../../../client/build")));

/**tus middleware */
//const server = new tus.Server(); 
const tusServer = new tus.Server(); // create tus server
const tusServer2 = new tus.Server(); 




tusServer.datastore = new tus.FileStore({
    path: '/api/files',        
});


// --------- get the original name file from request header (tus client)------
const fileNameFromUrl = (req) => {
  let uploadMetadata=req.headers['upload-metadata'];
 let metadata=metadataStringToObject(uploadMetadata)
    console.log("metadata:",metadata)
  let ch =req.url.replace(/\//g, metadata["filename"]);
   return ch.replace(/ /g, '_')

 }
  // function to decrypt req.headers['upload-metadata'] from base64 toString("ascii")
 const metadataStringToObject = (stringValue) => {
   const keyValuePairList = stringValue.split(',')
 
   return keyValuePairList.reduce((metadata, keyValuePair) => {
     let [key, base64Value] = keyValuePair.split(' ')
     metadata[key] = new Buffer(base64Value, "base64").toString("ascii")
 
     return metadata
   }, {})
 }
 
 //------------------------------------------------------------------------------------
 
 tusServer2.datastore = new tus.FileStore({
   path: '/api/backups',
   namingFunction: fileNameFromUrl
 });
 const uploadApp = express();
 uploadApp.all('*', tusServer.handle.bind(tusServer));
 const uploadApp2 = express();
 uploadApp2.all('*', tusServer.handle.bind(tusServer2));
 // end tus middleware

// Cors
app.use(cors());

//logger
app.use(logger("dev"));

//bodyParser
app.use(bodyParser.json({ limit: "50mb" })); // limit to 50mb in order to allow saving large file such img
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//middleware to access images stored in backend
app.use("/files",express.static(path.resolve(__dirname + "/files")));
app.use("/*/files",express.static(path.resolve(__dirname + "/files")));



app.use(session({ secret: 'SECRET' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//--------------- Routes ---------------//


app.use('/upload',uploadApp);// upload images using uppy & tus-client & tus-node-server
app.use('/upload-backups',uploadApp2);// upload files 



//download files
app.post('/download', function(req, res){
  const {path,fileName}=req.body
  //const file =path.resolve(__dirname) ;
  console.log("__dirname:",`${__dirname}/${path}`)
  let pathFile=`${__dirname}/${path}`
  console.log("pathFile:",pathFile)
  res.download(pathFile,fileName); // Set disposition and send it.
});

//delete files
app.post('/unlink', function(req, res,next){
  const {path,fileName}=req.body
  //const file =path.resolve(__dirname) ;
  console.log("__dirname:",`${__dirname}/${path}`)
  let pathFile=`${__dirname}/${path}`
  console.log("pathFile:",pathFile)
  try{
  fs.unlink(pathFile, function (err) {
    if (err) res.send({success:false,error:err});
    // if no error, file has been deleted successfully
    console.log('File deleted!');
    res.send({success:true})
});
  }catch(e){
    next(e)
  }
});



app.use(router); 

// --------- Errors -------------//
//the Error-middlewares must be in the end of file and befor "module-export"

app.use((req, res, next) => {
  var err = new Error(`URL : [${req.originalUrl}] => Not found`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "Error processing your request";
  res.status(status).send({
    error
  });
});
/** on peut aussi utiliser cette petit fct:
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});*/
//---------------Exportation---------//



module.exports = app;
