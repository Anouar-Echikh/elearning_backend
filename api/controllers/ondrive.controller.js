
const getStream = require('into-stream')


const fs = require('fs');
 

// Get the socket connection from Express app


const ondriveController = {};





ondriveController.uploadDiplomaToOneDrive=async(req,res,next)=>{
  
  let files = req.files;
  let token=req.body.token
  let path=req.body.path
  let fileId=req.body.fileId
  let itemId=req.body.itemId
  let multipleFiles=req.body.multipleFiles
 
  //const io =req.app.get('io')

  const io = req.app.get('io');    
  const sockets = req.app.get('sockets');
  const sessionId = req.app.get('sessionId');
  const thisSocketId = sockets[sessionId];
  const socketInstance = io.to(thisSocketId);
  

      
  /**--------------------------------- */
if (req != null && files != null && files.length > 0) {  
  for (var i = 0; i < files.length; i++) {
    let file=files[i]
    try {
      // 
      uploadDiplomaSession(file,itemId,multipleFiles,fileId,token,path,socketInstance,res,next)
      // if (i === req.files.length -1) {
        //res.send( { success: 'File uploaded to OneDrive storage.',item });
      // }
      
    } catch (err) {
      
      res.send( { error: err });
     }
  }
  
}
}

// ---------------- upload file certificate ---------------


const uploadFileSession=async(file,itemId,multipleFiles,fileId,token,path,io,res,next)=>{
  const
           blobName = getBlobName(file.originalname)
         , stream = getStream(file.buffer)
         , streamLength = file.buffer.length
     ;
   // const createReadStream = require('fs').createReadStream
 
   // const rsFile=createReadStream("api/"+file.src)
   oneDriveAPI.items.uploadSession({
     accessToken: token,
     filename:file.originalname,  
     parentPath:path,  
     fileSize: file.size,
     readableStream: stream//myReadableStreamBuffer
   }, (bytesUploaded) => {
       
     var percentage =Math.round(parseFloat((bytesUploaded / streamLength) * 100));
     let obj={
       id:fileId,
       bytesUploaded:bytesUploaded ,  
       bytesTotal:file.size ,
       percentage}
     console.log("uploading..",percentage+"%")
   
    io.emit('uploadProgress', obj);
   
   }).then((async (item) => { 
 
  
 
  //delete file from server
   // require('fs').unlink("api/"+file.src, (err)=>{
   //   if (err) throw err;
   //   // if no error, file has been deleted successfully
   //   console.log('File deleted!');
   
  // })
 // io.emit('uploadProgress', `50%`);
  console.log("Uploaded with success!")
  res.send({success:"ok",item})
   //pushItems(item)
    }))
    .catch((error) => {
          console.log(error)
        // res.send({file,token})
        //  next(error)
          //error.response.statusCode  => error code
         // error.response.statusMessage => error message
       })
 
}

ondriveController.uploadFileToOneDrive=async(req,res,next)=>{
  
  let files = req.files;
  let token=req.body.token
  let path=req.body.path
  let fileId=req.body.fileId
  let itemId=req.body.itemId
  let multipleFiles=req.body.multipleFiles
 
  //const io =req.app.get('io')

  const io = req.app.get('io');    
  const sockets = req.app.get('sockets');
  const sessionId = req.app.get('sessionId');
  const thisSocketId = sockets[sessionId];
  const socketInstance = io.to(thisSocketId);
  

      
  /**--------------------------------- */
if (req != null && files != null && files.length > 0) {  
  for (var i = 0; i < files.length; i++) {
    let file=files[i]
    try {
      // 
      uploadFileSession(file,itemId,multipleFiles,fileId,token,path,socketInstance,res,next)
      // if (i === req.files.length -1) {
        //res.send( { success: 'File uploaded to OneDrive storage.',item });
      // }
      
    } catch (err) {
      
      res.send( { error: err });
     }
  }
  
}
}

module.exports = ondriveController;