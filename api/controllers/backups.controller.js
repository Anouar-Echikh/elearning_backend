const { spawn } = require('child_process');
//const path = require('path');
//const cron = require('node-cron');
//const Backup =require('../models/backup.model')
const BackupsController = {};
const moment = require('moment');
const fs = require('fs');
//import {fileMetadata} from 'file-metadata';



/* 
Basic mongo dump and restore commands, they contain more options you can have a look at man page for both of them.
1. mongodump --db=rbac_tutorial --archive=./rbac.gzip --gzip
2. mongorestore --db=p4st --archive=./backups/p4st/p4st.gzip --gzip

With Docker :  (mongodump - mongorestore)
const dockerProcess = spawn('docker',['exec','mongo','sh','-c','mongodump --db=p4st --archive=./backups/p4st/p4st.gzip --gzip']);
const dockerProcess = spawn('docker',['exec','mongo','sh','-c','mongorestore --db=p4st --archive=./backups/p4st/p4st.gzip --gzip']);


Using mongodump - without any args:
  will dump each and every db into a folder called "dump" in the directory from where it was executed.
Using mongorestore - without any args:
  will try to restore every database from "dump" folder in current directory, if "dump" folder does not exist then it will simply fail.
*/

//const DB_NAME = 'p4st';
//const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`);

// 1. Cron expression for every 5 seconds - */5 * * * * *
// 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// Note: 2nd expression only contains 5 fields, since seconds is not necessary

// Scheduling the backup every 5 seconds (using node-cron)
//cron.schedule('*/5 * * * * *', () => backupMongoDB());

BackupsController.getLastSavedBackup = async (req, res, next) => {
       
    try {
      const backups = await Backup.find().sort({ date: -1 });
      res.send({ lastBackup:backups[0] });
     } catch (e) {
  
      next(e);
    }
  };

 // createCustomBackupVideo
BackupsController.createBackupMongoDBFile = async (req, res, next) => {

    const dbName = req.params.dbName;
    const user = req.user; 

    // const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`);

    //  Docker  let filePath=`./backups/p4st/Backup_${dbName}_${moment(new Date()).format("DD-MM-YYYY-HH:mm")}.gzip`


    // const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);

//try {
    
    const newBackup = new Backup({
        date:new Date(),
        title:`Backup_${Date.now()}.gzip`,
        user: {
          email:user.local.email,
          name:user.name
        }
      });
    
     
        const savedBackup = await newBackup.save();
        

    let filePath = `./api/backups/Backup_${Date.now()}.gzip`
    const child = spawn('mongodump', [`--db=${dbName}`, `--archive=${filePath}`, '--gzip']);



    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data);
    });

    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString());
    });

    child.on('error', (error) => {
        console.log('error:\n', error);
    });
    child.on('exit', (code, signal) => {
        if (code) {
            fs.readdir('./api/backups', function (err, files) {
                //handling error
                if (err) {
                    res.send({ success: false, error: `Unable to scan directory:${err}` });
                }

                res.send({ success: false, result: `Process exit with code:${code}` });
            });



        } else if (signal) {
            fs.readdir('./api/backups', function (err, files) {
                //handling error
                if (err) {
                    res.send({ success: false, error: `Unable to scan directory:${err}` });
                }



                res.send({ success: false, result: `Process killed with signal:${signal}` });
            });

        } else {
            //
            fs.readdir('./api/backups', function (err, files) {
                //handling error
                if (err) {
                    res.send({ success: false, error: `Unable to scan directory:${err}` });
                }

                if (files.length > 0) {
                    var listFilesBackup = []

                    for (let index = 0; index < files.length; index++) {
                        const file = files[index];


                        let pathFile = `./api/backups/${file}`


                        // Getting information for a directory
                        fs.stat(pathFile, (error, stats) => {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log(`Stats object for:${file}`);
                                console.log(stats);
                                let propertiesObj = {}

                                propertiesObj.filename = file;
                                propertiesObj.created = stats.birthtime;
                                propertiesObj.size = stats.size;
                                listFilesBackup.push(propertiesObj)
                                console.log("propertiesObj", propertiesObj)
                                console.log("listFilesBackup", listFilesBackup)
                                if (index == files.length - 1) {
                                    console.log('files.length:', files.length)
                                    res.send({ success: true, result: 'Backup is successfull ✅', listFiles: listFilesBackup,savedBackup });
                                }

                            }
                        });
                    }
                } else {
                    res.send({ success: true, listFiles: [],savedBackup });
                }

            });

        }
    });
// } catch (error) {
//     res.send({success: false, error:error})
// }

    /*  //Docker
     dockerProcess.stdout.on('data', (data) => {
          console.log('stdout:\n', data);
       });
  
  
        dockerProcess.stderr.on('data', (data) => {
          console.log('stderr:\n', Buffer.from(data).toString());
        });
        dockerProcess.on('error', (error) => {
          console.log('error:\n', error);
        });
        dockerProcess.on('exit', (code, signal) => {
          if (code) console.log('Process exit with code:', code);
          else if (signal) console.log('Process killed with signal:', signal);
          else console.log('Backup is successfull ✅');
        });
  */
}

BackupsController.restoreMongoDB = async (req, res, next) => {

    const fileName = req.params.fileName;


    // const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);
    // let restoreFilePath=`./api/backups/${fileName}`
    // const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);

    //we should drop db first
    // mongoose.connect(process.env.MONGO_DB_URI, {
    //     useNewUrlParser: true,
    //     useCreateIndex: true
    // });

    //mongoose.connection.dropDatabase(() => {
    console.log("Database connected and deleted with success !");
    //const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongorestore --db=${dbName} --archive=${restoreFilePath} --gzip`]);


    let restoreFilePath = `./api/backups/${fileName}`

    const child = spawn('mongorestore', ['--nsInclude=elearning.*', '--drop', `--archive=${restoreFilePath}`, '--gzip']);


    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data);
    });

    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString());
    });

    child.on('error', (error) => {
        console.log('error:\n', error);
    });

    child.on('exit', (code, signal) => {
        if (code) {
            res.send({ success: false, result: `Process exit with code:${code}` });
        } else if (signal) {
            res.send({ success: false, result: `Process killed with signal:${signal}` });
        } else {
            res.send({ success: true, result: 'Restoration DB is successfull ✅' });
        }
    });

    //  });
    /*  //Docker
     dockerProcess.stdout.on('data', (data) => {
          console.log('stdout:\n', data);
       });
  
  
        dockerProcess.stderr.on('data', (data) => {
          console.log('stderr:\n', Buffer.from(data).toString());
        });
        dockerProcess.on('error', (error) => {
          console.log('error:\n', error);
        });
        dockerProcess.on('exit', (code, signal) => {
          if (code) console.log('Process exit with code:', code);
          else if (signal) console.log('Process killed with signal:', signal);
          else console.log('Backup is successfull ✅');
        });
  */
}

BackupsController.getListFiles = async (req, res, next) => {

    fs.readdir('./api/backups',async function (err, files) {
        //handling error
        if (err) {
            res.send({ success: false, error: `Unable to scan directory:${err}` });

        }

        if (files.length > 0) {

            var listFilesBackup = []

            for (let index = 0; index < files.length; index++) {
                const file = files[index];


                let pathFile = `./api/backups/${file}`

             

                //Getting information for a directory
                fs.stat(pathFile, (error, stats) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(`Stats object for:${file}`);
                        console.log(stats);
                        let propertiesObj = {}

                        propertiesObj.filename = file;
                        propertiesObj.created = stats.birthtime;//get creation date from file properties
                        propertiesObj.size = stats.size;
                        listFilesBackup.push(propertiesObj)
                        console.log("propertiesObj", propertiesObj)
                        
                       
                        if (index == files.length - 1) {
                            console.log("listFilesBackup", listFilesBackup)
                            console.log('files.length:', files.length)
                            res.send({ success: true, listFiles: listFilesBackup });
                        }
                    }
                });
            }
        } else {
            res.send({ success: true, listFiles: [] });
        }
    });
}

 // createCustomBackupVideo
 BackupsController.createCustomBackupVideo = async (req, res, next) => {
try{
    const data= req.body;
    const user = req.user; 
    
    
    
 
        //------------localhost--
        const dbName="elearning"
        let vid_query=`{"_id": {"$oid":"${data._id}"}}`;
        let filePath = `./api/backups/Backup_${data.title.replace(/ /g, '_')}.json`
        const child = spawn('mongoexport', [`--db=${dbName}`, `-c=videos`,`-q=${vid_query}`, `--out=${filePath}`]);
    // -----end localhost----------------
    
    // -------Docker plesk-------------
  //  const dbName="elearning"
   //let vid_query=`'{"_id": {"$oid":"${data._id}"}}'`;//pour docker commande :  we must put {} between ''
   // let collectionName='videos';
    //let filePath = `./backups/elearning/Backup_${data.title}.json`
    // const child = spawn('docker',['exec','mongo','sh','-c',`mongoexport  --db=${dbName} --collection ${collectionName} --query ${vid_query} --out=${filePath}`]);
    //---------end Docker plesk ---------------------


    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data);
    });

    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString());
    });

    child.on('error', (error) => {
        console.log('error:\n', error);
    });
    child.on('exit', (code, signal) => {
        if (code) {
            fs.readdir('./api/backups', function (err, files) {
                //handling error
                if (err) {
                    res.send({ success: false, error: `Unable to scan directory:${err}` });
                }

                res.send({ success: false, result: `Process exit with code:${code}` });
            });



        } else if (signal) {
            fs.readdir('./api/backups', function (err, files) {
                //handling error
                if (err) {
                    res.send({ success: false, error: `Unable to scan directory:${err}` });
                }



                res.send({ success: false, result: `Process killed with signal:${signal}` });
            });

        } else {
            //
            fs.readdir('./api/backups', function (err, files) {
                //handling error
                if (err) {
                    res.send({ success: false, error: `Unable to scan directory:${err}` });
                }

                if (files.length > 0) {
                    var listFilesBackup = []

                    for (let index = 0; index < files.length; index++) {
                        const file = files[index];


                        let pathFile = `./api/backups/${file}`


                        // Getting information for a directory
                        fs.stat(pathFile, (error, stats) => {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log(`Stats object for:${file}`);
                                console.log(stats);
                                let propertiesObj = {}

                                propertiesObj.filename = file;
                                propertiesObj.created = stats.birthtime;
                                propertiesObj.size = stats.size;
                                listFilesBackup.push(propertiesObj)
                                // console.log("propertiesObj", propertiesObj)
                                // console.log("listFilesBackup", listFilesBackup)
                                if (index == files.length - 1) {
                                    console.log('files.length:', files.length)
                                    res.send({ success: true, result: 'Backup is successfull ✅', listFiles: listFilesBackup });
                                }

                            }
                        });
                    }
                } else {
                    res.send({ success: true, listFiles: [] });
                }

            });

        }
    });
}catch(e){
    next(e)
}
}

BackupsController.restoreCustomMongoDB = async (req, res, next) => {

    try{

    const fileName = req.params.fileName;

    const dbName="elearning"
    

    // const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);
    // let restoreFilePath=`./api/backups/${fileName}`
    // const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);

    //we should drop db first
    // mongoose.connect(process.env.MONGO_DB_URI, {
    //     useNewUrlParser: true,
    //     useCreateIndex: true
    // });

    //mongoose.connection.dropDatabase(() => {
   // console.log("Database connected and deleted with success !");
    //const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongorestore --db=${dbName} --archive=${restoreFilePath} --gzip`]);


    //mongoimport -u root -p root12369 --authenticationDatabase admin --db=elearning --collection videos --mode=upsert --file=./diversBackups/videos2.json 

    
    

    
//------------localhost----
let restoreFilePath = `./api/backups/${fileName}`
const child = spawn('mongoimport', [ `--db=${dbName}`,'--collection=videos', '--mode=upsert',`--file=${restoreFilePath}`]);
//------------end localhost----


// -------Docker plesk-------------
//let filePath = `./backups/elearning/${fileName}`
//const child = spawn('docker',['exec','mongo','sh','-c',`mongoimport -u root -p root12369 --authenticationDatabase admin --db=${dbName} --collection videos --mode=upsert --file=${filePath}`]);
//---------end Docker plesk ---------------------

    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data);
    });

    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString());
    });

    child.on('error', (error) => {
        console.log('error:\n', error);
    });

    child.on('exit', (code, signal) => {
        if (code) {
            res.send({ success: false, result: `Process exit with code:${code}` });
        } else if (signal) {
            res.send({ success: false, result: `Process killed with signal:${signal}` });
        } else {
            res.send({ success: true, result: 'Restoration DB is successfull ✅' });
        }
    });
    }catch(e){
        next(e)
    }
   
}

BackupsController.getListFiles = async (req, res, next) => {

    fs.readdir('./api/backups',async function (err, files) {
        //handling error
        if (err) {
            res.send({ success: false, error: `Unable to scan directory:${err}` });

        }

        if (files.length > 0) {

            var listFilesBackup = []

            for (let index = 0; index < files.length; index++) {
                const file = files[index];


                let pathFile = `./api/backups/${file}`

             

                //Getting information for a directory
                fs.stat(pathFile, (error, stats) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(`Stats object for:${file}`);
                        console.log(stats);
                        let propertiesObj = {}

                        propertiesObj.filename = file;
                        propertiesObj.created = stats.birthtime;//get creation date from file properties
                        propertiesObj.size = stats.size;
                        listFilesBackup.push(propertiesObj)
                        console.log("propertiesObj", propertiesObj)
                        
                       
                        if (index == files.length - 1) {
                            console.log("listFilesBackup", listFilesBackup)
                            console.log('files.length:', files.length)
                            res.send({ success: true, listFiles: listFilesBackup });
                        }
                    }
                });
            }
        } else {
            res.send({ success: true, listFiles: [] });
        }
    });
}

//app.post('/unlink', function(req, res){
BackupsController.removeBackupFile = async (req, res, next) => {
    const fileName = req.params.fileName
    //const file =path.resolve(__dirname) ;
    console.log("__dirname:", `${__dirname}/../backups/${fileName}`)
    //let pathFile1 = `${__dirname}/${path}`
    let pathFile = `${__dirname}/../backups/${fileName}`
    console.log("pathFile:", pathFile)
    try {
        fs.unlink(pathFile, function (err) {
            if (err) res.send({ success: false, error: err });
            // if no error, file has been deleted successfully
            console.log('File deleted!');
            res.send({ success: true })
        });
    } catch (e) {
        console.log(e)
    }
}

BackupsController.downloadBackupFile = async (req, res, next) => {

    try {
        const fileName = req.params.fileName.replace(/ /g, '_')
        //const file =path.resolve(__dirname) ;
        console.log("__dirname:", `${__dirname}/../backups/${fileName}`)
        //let pathFile1 = `${__dirname}/${path}`
        let pathFile = `${__dirname}/../backups/${fileName}`
        console.log("pathFile:", pathFile)
        res.download(pathFile, fileName);
    } catch (e) {
        console.log(e)
    }
}
module.exports = BackupsController;

//******************************For Plesk--------**************** */
/*
const { spawn } = require('child_process');
const path = require('path');
//const cron = require('node-cron');
const BackupsController = {};
const moment = require('moment');
const fs = require('fs');
const Backup =require('../models/backup.model')

/* 
Basic mongo dump and restore commands, they contain more options you can have a look at man page for both of them.
1. mongodump --db=rbac_tutorial --archive=./rbac.gzip --gzip
2. mongorestore --db=p4st --archive=./backups/p4st/p4st.gzip --gzip

With Docker :  (mongodump - mongorestore)
const dockerProcess = spawn('docker',['exec','mongo','sh','-c','mongodump --db=p4st --archive=./backups/p4st/p4st.gzip --gzip']);
const dockerProcess = spawn('docker',['exec','mongo','sh','-c','mongorestore --db=p4st --archive=./backups/p4st/p4st.gzip --gzip']);


Using mongodump - without any args:
  will dump each and every db into a folder called "dump" in the directory from where it was executed.
Using mongorestore - without any args:
  will try to restore every database from "dump" folder in current directory, if "dump" folder does not exist then it will simply fail.
*/

//const DB_NAME = 'p4st';
//const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`);

// 1. Cron expression for every 5 seconds - */5 * * * * *
// 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// Note: 2nd expression only contains 5 fields, since seconds is not necessary

// Scheduling the backup every 5 seconds (using node-cron)
//cron.schedule('*/5 * * * * *', () => backupMongoDB());

// BackupsController.getLastSavedBackup = async (req, res, next) => {
       
//     try {
//       const backups = await Backup.find().sort({ date: -1 });
//       res.send({ lastBackup:backups[0] });
//      } catch (e) {
  
//       next(e);
//     }
//   };




// BackupsController.createBackupMongoDBFile = async (req, res, next) => {

//     const dbName = req.params.dbName;
//     const user = req.user; 

    
    
//     const newBackup = new Backup({
//         date:new Date(),
//         title:`Backup_${moment(new Date()).format("DD-MM-YYYY-HH:mm")}.gzip`,
//         user: {
//           email:user.local.email,
//           name:user.name
//         }
//       });
    
     
//         const savedBackup = await newBackup.save();// to get date of this restoration after restoration and put it in notification

     

//       let filePath=`./backups/p4st/Backup_${moment(new Date()).format("DD-MM-YYYY-HH:mm")}.gzip` // path in docker container

//      const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);



// /* ---------local project win 10------
//   //  let filePath = `./api/backups/Backup_${Date.now()}.gzip`
//    // const child = spawn('mongodump', [`--db=${dbName}`, `--archive=${filePath}`, '--gzip']);  // you should change dockerProcess by  child
// // ---------local project win 10------*/


//     dockerProcess.stdout.on('data', (data) => {
//         console.log('stdout:\n', data);
//     });

//     dockerProcess.stderr.on('data', (data) => {
//         console.log('stderr:\n', Buffer.from(data).toString());
//     });

//     dockerProcess.on('error', (error) => {
//         console.log('error:\n', error);
//     });
//     dockerProcess.on('exit', (code, signal) => {
//         if (code) {
//             fs.readdir('./api/backups', function (err, files) {
//                 //handling error
//                 if (err) {
//                     res.send({ success: false, error: `Unable to scan directory:${err}` });
//                 }
                
//                 res.send({ success: false, result: `Process exit with code:${code}` });
//             });



//         } else if (signal) {
//             fs.readdir('./api/backups', function (err, files) {
//                 //handling error
//                 if (err) {
//                     res.send({ success: false, error: `Unable to scan directory:${err}` });
//                 }



//                 res.send({ success: false, result: `Process killed with signal:${signal}` });
//             });

//         } else {
//             //
//             fs.readdir('./api/backups', function (err, files) {
//                 //handling error
//                 if (err) {
//                     res.send({ success: false, error: `Unable to scan directory:${err}` });
//                 }

//               if(files.length>0){
//                 var listFilesBackup = []

//                 for (let index = 0; index < files.length; index++) {
//                     const file = files[index];
            
            
//                     let pathFile = `./api/backups/${file}`
            
            
//                     // Getting information for a directory
//                     fs.stat(pathFile, (error, stats) => {
//                         if (error) {
//                             console.log(error);
//                         }
//                         else {
//                             console.log(`Stats object for:${file}`);
//                             console.log(stats);
//                             let propertiesObj = {}
            
//                             propertiesObj.filename = file;
//                             propertiesObj.created = stats.birthtime;
//                             propertiesObj.size = stats.size;
//                             listFilesBackup.push(propertiesObj)
//                             console.log("propertiesObj", propertiesObj)
//                             console.log("listFilesBackup", listFilesBackup)
//                             if (index == files.length - 1) {
//                             console.log('files.length:', files.length)
//                             res.send({ success: true, result: 'Backup is successfull ✅', listFiles: listFilesBackup,savedBackup });
//                         }
// 						}
//                     });
//                 }
// }else{
//     res.send({ success: true, listFiles: [],savedBackup });
// }
                
//             });

//         }
//     });


//     /*  //Docker
//      dockerProcess.stdout.on('data', (data) => {
//           console.log('stdout:\n', data);
//        });
  
  
//         dockerProcess.stderr.on('data', (data) => {
//           console.log('stderr:\n', Buffer.from(data).toString());
//         });
//         dockerProcess.on('error', (error) => {
//           console.log('error:\n', error);
//         });
//         dockerProcess.on('exit', (code, signal) => {
//           if (code) console.log('Process exit with code:', code);
//           else if (signal) console.log('Process killed with signal:', signal);
//           else console.log('Backup is successfull ✅');
//         });
//   */
// }

// BackupsController.restoreMongoDB = async (req, res, next) => {

//     const fileName = req.params.fileName;


//     // const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);
//     // let restoreFilePath=`./api/backups/${fileName}`
//     // const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongodump --db=${dbName} --archive=${filePath} --gzip`]);

    
	


//         let restoreFilePath = `./backups/p4st/${fileName}` // path in docker container

//      //   const child = spawn('mongorestore', ['--nsInclude=p4st.*','--drop' ,`--archive=${restoreFilePath}`, '--gzip']);
// const dockerProcess = spawn('docker',['exec','mongo','sh','-c',`mongorestore --nsInclude=p4st.* --drop --archive=${restoreFilePath} --gzip`]);


//         dockerProcess.stdout.on('data', (data) => {
//             console.log('stdout:\n', data);
//         });

//         dockerProcess.stderr.on('data', (data) => {
//             console.log('stderr:\n', Buffer.from(data).toString());
//         });

//         dockerProcess.on('error', (error) => {
//             console.log('error:\n', error);
//         });

//         dockerProcess.on('exit', (code, signal) => {
//             if (code) {
//                 res.send({ success: false, result: `Process exit with code:${code}` });
//             } else if (signal) {
//                 res.send({ success: false, result: `Process killed with signal:${signal}` });
//             } else {
//                 res.send({ success: true, result: 'Restoration DB is successfull ✅' });
//             }
//         });
// }

// BackupsController.getListFiles = async (req, res, next) => {

//     fs.readdir('./api/backups', function (err, files) {
//         //handling error
//         if (err) {
//             res.send({ success: false, error: `Unable to scan directory:${err}` });

//         }
       
//         if(files.length>0){

//         var listFilesBackup = []

//         for (let index = 0; index < files.length; index++) {
//             const file = files[index];
    
    
//             let pathFile = `./api/backups/${file}`
    
    
//             // Getting information for a directory
//             fs.stat(pathFile, (error, stats) => {
//                 if (error) {
//                     console.log(error);
//                 }
//                 else {
//                     console.log(`Stats object for:${file}`);
//                     console.log(stats);
//                     let propertiesObj = {}
    
//                     propertiesObj.filename = file;
//                     propertiesObj.created = stats.birthtime;//get creation date from file properties
//                     propertiesObj.size = stats.size;
//                     listFilesBackup.push(propertiesObj)
//                     console.log("propertiesObj", propertiesObj)
//                     console.log("listFilesBackup", listFilesBackup)
//                     if (index == files.length - 1) {
//                             console.log('files.length:', files.length)
//                             res.send({ success: true, listFiles: listFilesBackup });
//                         }
//                 }
//             });
//         }
//     }else{
//         res.send({ success: true, listFiles: [] });
//     }  
//     });
// }


// //app.post('/unlink', function(req, res){
// BackupsController.removeBackupFile = async (req, res, next) => {
//     const fileName  = req.params.fileName
//     //const file =path.resolve(__dirname) ;
//     console.log("__dirname:", `${__dirname}/../backups/${fileName}`)
//     //let pathFile1 = `${__dirname}/${path}`
//     let pathFile = `${__dirname}/../backups/${fileName}`
//     console.log("pathFile:", pathFile)
//     try {
//         fs.unlink(pathFile, function (err) {
//             if (err) res.send({ success: false, error: err });
//             // if no error, file has been deleted successfully
//             console.log('File deleted!');
//             res.send({ success: true })
//         });
//     } catch (e) {
//         console.log(e)
//     }
// }

// BackupsController.downloadBackupFile = async (req, res, next) => {

// try{
//     const fileName  = req.params.fileName
//     //const file =path.resolve(__dirname) ;
//     console.log("__dirname:", `${__dirname}/../backups/${fileName}`)
//     //let pathFile1 = `${__dirname}/${path}`
//     let pathFile = `${__dirname}/../backups/${fileName}`
//     console.log("pathFile:", pathFile)
//     res.download(pathFile,fileName);
//     } catch (e) {
//         console.log(e)
//     }
// }
// module.exports = BackupsController;
