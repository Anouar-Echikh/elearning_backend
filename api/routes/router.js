const express = require("express");
//const router = express.Router();
const router = require("express-promise-router")();
const passport = require("passport");
const userController = require("../controllers/users.controller");
const studentController = require("../controllers/students.controller");
const emailController = require("../controllers/email.controller");
const smsController = require("../controllers/sms.controller");
const clientController = require("../controllers/client.controller");
const supplierController = require("../controllers/supplier.controller");
//const notificationController = require("../controllers/notification.controller");
const messageController = require("../controllers/message.controller");
const saleDocController = require("../controllers/saleDoc.controller");
const checksController = require("../controllers/checks.controller");
const purchaseDocController = require("../controllers/purchaseDoc.controller");
const productController = require("../controllers/product.controller");
const detailsDocController = require("../controllers/detailsDoc.controller");
const categoryProductController = require("../controllers/categoryProduct.controller");
const companyController = require("../controllers/company.controller");
const aboutController = require("../controllers/aboutController");
const eventController = require("../controllers/eventController");
const programController = require("../controllers/programController");
const newsController = require("../controllers/newsController");
const sponsorsController = require("../controllers/sponsorsController");
const videosController = require("../controllers/videosController");
const themesController = require("../controllers/themesController");
const organizationController = require("../controllers/organizationsController");
const departmentController = require("../controllers/departmentsController");
const subDepartmentController = require("../controllers/subDepartmentsController");
const commentsController = require("../controllers/commentsController");
const inscriptionsController = require("../controllers/inscriptionsController");
const verifTelEmailController = require("../controllers/verifTelEmail.controller");
const onedriveController = require("../controllers/ondrive.controller");
const notificationController = require("../controllers/notifications.controller");
const backupsController = require("../controllers/backups.controller");
const excelExamplsController = require("../controllers/examplesExcels.controller");

const path = require("path");
const tus = require('tus-node-server');
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).array('uploads')
const getStream = require('into-stream')


// *** SET STORAGE in system file ***
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({ storage: storage });
//const upload = multer({ dest: __dirname + "../../uploads/images" });

//auth and sign up & retrive account

router.post("/signUp", userController.register);
router.post("/login", userController.login);

router.post("/unlock", userController.unlockUser);
router.get("/user/:email", userController.getUserByEmail);
router.post("/sendCodeByEmail", emailController.sendEmail);
router.post("/sendCodeBySMS", smsController.sendSMS);
router.put("/changeUserPwd", userController.updatePassword);
router.get("/users/getUserByCINPass/:id", userController.getUserByCINPAss);
router.get("/orgs/getAll", organizationController.getAll);

 
  router.post("/OAuth/oneDrive",userController.oneDriveOAuth)
  //permession  to get list sponsor
  router.get("/sponsors/getAll", sponsorsController.getAll);
  router.get("/event/getAll", eventController.getAllEvents);
  router.get("/event/getAllEventHome", eventController.getAllEventsHome);
  router.get("/event/programs/:idEvent", programController.getAllByEventId);
  router.get("/news/getAll", newsController.getAll);
  
  router.post("/xhrUploadDiploma",uploadStrategy,onedriveController.uploadDiplomaToOneDrive)
  
  //router.get("/xhrUpload",onedriveController.uploadToOneDrive)
  router.post("/inscription/create", inscriptionsController.create);
  router.patch("/inscription/patch/:id", inscriptionsController.patch);
  router.get("/inscription/getOne/:idInsc", inscriptionsController.getOneById);
  router.get("/inscription/getAll", inscriptionsController.getAll);
  router.post("/sendEmailVerificationCode", verifTelEmailController.codeVerificationEmail);
  router.post("/sendEmailFromClient", emailController.sendEmail);
  router.post("/sendTelVerificationCode", verifTelEmailController.codeVerificationTel);  
  router.get("/orgs/getOneByPrefix/:prefix", organizationController.getOneByPrefix);

  // Customize auth message Protect the  routes

router.all("*", (req, res, next) => {

  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("You are not authorized to access this area");
      error.status = 401;
      throw error;
    }

    req.user = user;
    return next();
  })(req, res, next);
 
});

router.get("/user", userController.currentUser);
router.put("/logOut", userController.logOut);
//users
router.get("/users", userController.getAllUsers);
router.post("/users/getByListIds", userController.getUsersByListId);
router.post("/users/create", userController.addUser);
router.get("/users/:id", userController.getUserById);

//router.put("/users/:user_id", userController.update);
router.patch("/users/patch/:id", userController.patch);
router.delete("/users/:user_id", userController.destroy);


// Students
router.get("/students", studentController.getAllUsers);
router.post("/students/getByListIds", studentController.getUsersByListId);
router.post("/students/create", studentController.addUser);

router.get("/students/:id", studentController.getUserById);
router.patch("/students/patch/:id", studentController.patch);
router.delete("/students/:user_id", studentController.destroy);





//client
router.post("/createClient", clientController.create);
router.get("/getAllClients", clientController.getAllClients);
router.get("/getClientById/:id", clientController.getClientById);
router.get(
  "/getAllClientsBySearchText/:text",
  clientController.getAllClientsBySearchText
);
router.get(
  "/getClientByNumAccount/:num",
  clientController.getClientByNumAccount    
);
router.put("/updateClient/:id", clientController.update);
router.delete("/destroyClient/:id", clientController.destroy);

//supplier
router.post("/createSupplier", supplierController.create);
router.get("/getAllSupliers", supplierController.getAllSupliers);
router.get("/getSupplierById/:id", supplierController.getSupplierById);
router.get(
  "/getAllSuppliersBySearchText/:text",
  supplierController.getAllSuppliersBySearchText
);
router.get(
  "/getSupplierByNumAccount/:num",
  supplierController.getSupplierByNumAccount
);
router.put("/updateSupplier/:id", supplierController.update);
router.delete("/destroySupplier/:id", supplierController.destroy);

//notification
router.post("/createNotification", notificationController.create);
router.post("/reminder", notificationController.reminder);
//router.post("/sendNotificationByEmail", emailController.sendEmail);
//router.post("/stopEmailReminder", emailController.StopEmailReminder);
router.post("/stopReminder", notificationController.StopReminder);

router.get("/getAllNotifications", notificationController.getAllNotifications);
router.put(
  "/setToReadenNotification/:id",
  notificationController.setToReadenNotification
);
router.get(
  "/getAllNotificationsSortedByDateTimeAndLimited",
  notificationController.getAllNotificationsSortedByDateTimeAndLimited
);
router.get(
  "/getAllNotificationsBySearchText/:text",
  notificationController.getAllNotificationsBySearchText
);
router.get(
  "/getNotficationByReceiverId/:id",
  notificationController.getNotficationByReceiverId
);
router.get(
  "/getNotficationByType/:type",
  notificationController.getNotificationByType
);
router.get(
  "/getNotificationByImportance/:important",
  notificationController.getNotificationByImportance
);
router.delete("/destroyNotification/:id", notificationController.destroy);

//message
router.post("/sendMessage", messageController.sendMessage);
router.get("/getMessagesBySender/:id", messageController.getMessagesBySender);
router.get("/getMessagesById/:id", messageController.getMessagesById);
router.put("/sendToRecycleBin/:id", messageController.sendToRecycleBin);
router.put("/setToReadenMessage/:id", messageController.setToReadenMessage);
router.get("/getAllMessages", messageController.getAllMessages);
router.get(
  "/getMessagesBySentByCurrentUser",
  messageController.getMessagesBySentByCurrentUser
);
router.get(
  "/getAllMessagesSortedByDateTimeAndLimited",
  messageController.getAllMessagesSortedByDateTimeAndLimited
);

router.delete("/destroyMessage/:id", messageController.destroy);

//company
router.post("/createCompany", companyController.create);
router.get("/getAllCompanies", companyController.getAllCompanies);
router.get("/getCompanyById/:id", companyController.getCompanyById);
router.get(
  "/getCompanyByNumAccount/:num",
  companyController.getCompanyByNumAccount
);
router.put("/updateCompany/:id", companyController.update);
router.delete("/destroyCompany/:id", companyController.destroy);

//category Product
router.post("/createCategory", categoryProductController.create);
router.get("/categories", categoryProductController.getAllCategoryProducts);
router.get(
  "/getAllCategoryProductsBySearchText/:text",
  categoryProductController.getAllCategoryProductsBySearchText
);
router.get(
  "/getCategoryProductById/:id",
  categoryProductController.getCategoryProductById
);
router.get(
  "/getCategoryProductByRef/:ref",
  categoryProductController.getCategoryProductByRef
);
router.put("/updateCategory/:id", categoryProductController.update);
router.delete("/destroyCategory/:id", categoryProductController.destroy);

// Product
router.post("/createProduct", productController.create);
router.get("/products", productController.getAllProducts);
router.get("/getproductById/:id", productController.getProductById);
router.get(
  "/getAllProductsBySearchText/:text",
  productController.getAllProductsBySearchText
);
router.get("/getproductByRef/:ref", productController.getProductByRef);
router.get(
  "/getproductByCategory/:category",
  productController.getProductsByCategory
);
router.put("/updateProduct/:id", productController.update);
router.delete("/destroyProduct/:id", productController.destroy);

// sale Document
router.post("/createSaleDoc", saleDocController.create);
router.get(
  "/getLastSaleDocByType/:type",
  saleDocController.getLastSaleDocByType
);

router.get("/salesDoc", saleDocController.getAllSaleDocs);
router.get(
  "/getAllSaleDocsCurrentUser",
  saleDocController.getAllSaleDocsCurrentUser
);

router.get("/getSaleDocById/:id", saleDocController.getSaleDocById);
router.get("/getSaleDocByRef/:ref", saleDocController.getSaleDocByRef);
router.get(
  "/getSaleDocByCustomerId/:id",
  saleDocController.getSaleDocByCustomerId
);
router.get("/getSaleDocByType/:type", saleDocController.getSaleDocsByType);

router.get(
  "/getSaleDocByTypeAndCustomerId/:id",
  saleDocController.getSaleDocsByType
);

router.put("/updateSaleDoc/:id", saleDocController.update);
router.put("/addDetailsToDoc/:ref", saleDocController.addDetailsToDoc);
router.put(
  "/deleteDetailsFromDoc/:ref",
  saleDocController.deleteDetailsFromDoc
);
router.delete("/destroySaleDoc/:id", saleDocController.destroy);

//payement
//payementDetails

// Checks
router.post("/createCheck", checksController.create);
router.get("/checks", checksController.getAllChecks);
router.get("/getCheckById/:id", checksController.getCheckById);
router.get("/getChecksByRefDoc/:ref", checksController.getChecksByRefDoc);
router.put("/updateCheck/:id", checksController.update);
router.delete("/destroyCheck/:id", checksController.destroy);

// purchase Document
router.post("/createPurchaseDoc", purchaseDocController.create);
router.get(
  "/getAllPurchaseDocsAllUsers",
  purchaseDocController.getAllPurchaseDocsAllUsers
);
router.get(
  "/getAllPurchaseDocsCurrentUser",
  purchaseDocController.getAllPurchaseDocsCurrentUser
);
router.get("/getPurchaseDocById/:id", purchaseDocController.getPurchaseDocById);
router.get(
  "/getAllPurchaseDocsBySearchText/:text",
  purchaseDocController.getAllPurchaseDocsBySearchText
);
router.get(
  "/getPurchaseDocByRef/:ref",
  purchaseDocController.getPurchaseDocByRef
);
router.get(
  "/getPurchaseDocByType/:type",
  purchaseDocController.getPurchaseDocsByType
);
router.put("/updatePurchaseDoc/:id", purchaseDocController.update);
router.delete("/destroyPurchaseDoc/:id", purchaseDocController.destroy);

//detailsDoc
router.post("/createDetail", detailsDocController.create);
router.put("/updatedetailsDoc/:id", detailsDocController.update);
router.delete("/destroydetailsDoc/:id", detailsDocController.destroy);



//about
router.post("/about/save", aboutController.create);
router.get("/about", aboutController.get);
router.put("/about/update/:id", aboutController.update);
router.patch("/about/patch/:id", aboutController.patch);

//event
router.post("/event/create", eventController.create);
router.post("/event/addProgram/:idEvent", eventController.addProgram);

router.get("/event/:id", eventController.getEventById);
//router.put("/event/update/:id", eventController.update);
router.patch("/event/patch/:id", eventController.patch);
router.delete("/event/delete/:id", eventController.delete);
router.delete("/event/deleteProgram/:idEvent", eventController.deleteProgramFromEvent);


//program

router.get("/event/programs/:idProgram", programController.getOneById);
router.post("/event/program/create", programController.create);
router.put("/event/program/update/:id", programController.update);
router.patch("/event/program/patch/:id", programController.patch);
router.delete("/event/program/deleteOne/:id", programController.destroyOneById);
router.delete("/event/program/deleteAll/:idEvent", programController.destroyAllByEventId);

//news

router.get("/news/getOne/:idnews", newsController.getOneById);

router.post("/news/create", newsController.create);
router.patch("/news/patch/:id", newsController.patch);
router.delete("/news/deleteOne/:id", newsController.destroyOneById);

//sponsors

router.get("/sponsors/getOne/:idSponsor", sponsorsController.getOneById);
//router.get("/sponsors/getAll", sponsorsController.getAll);
router.post("/sponsors/create", sponsorsController.create);
router.patch("/sponsors/patch/:id", sponsorsController.patch);
router.delete("/sponsors/deleteOne/:id", sponsorsController.destroyOneById);

//videos

router.get("/videos/getOne/:id", videosController.getOneById);
router.get("/videos/getAllByTheme/:idTheme", videosController.getAllByTheme);
router.get("/videos/getAllByProf/:idProf", videosController.getAllByProf);
router.post("/videos/create", videosController.create);
router.patch("/videos/patch/:id", videosController.patch);
router.delete("/videos/deleteOne/:id", videosController.destroyOneById);
router.delete("/videos/deleteMany/:id", videosController.deleteManyByIdTheme);

//themes

router.get("/themes/getOne/:id", themesController.getOneById);
router.get("/themes/getAll/:idSubDep", themesController.getAll);
router.post("/themes/create", themesController.create);
router.patch("/themes/patch/:id", themesController.patch);
router.delete("/themes/deleteOne/:id", themesController.destroyOneById);
router.delete("/themes/deleteMany/:id",themesController.deleteManyByIdFormation);

//establishments

router.get("/orgs/getOne/:id", organizationController.getOneById);
router.post("/orgs/create", organizationController.create);
router.patch("/orgs/patch/:id", organizationController.patch);
router.delete("/orgs/deleteOne/:id", organizationController.destroyOneById);


//departments

router.get("/departments/getOne/:id", departmentController.getOneById);
router.get("/departments/getAll/:orgId", departmentController.getAll);
router.post("/departments/create", departmentController.create);
router.patch("/departments/patch/:id", departmentController.patch);
router.delete("/departments/deleteOne/:id", departmentController.destroyOneById);

//subDepartments

router.get("/sub-departments/getOne/:id", subDepartmentController.getOneById);
router.get("/sub-departments/getAll/:depId", subDepartmentController.getAll);
router.post("/sub-departments/create", subDepartmentController.create);
router.patch("/sub-departments/patch/:id", subDepartmentController.patch);
router.delete("/sub-departments/deleteOne/:id", subDepartmentController.destroyOneById);
router.delete("/sub-departments/deleteMany/:id", subDepartmentController.deleteManyByIdDepartment);

//comments

router.get("/comments/getOne/:id", commentsController.getOneById);
router.get("/comments/getAllByPostId/:id", commentsController.getAllByPostId);
router.post("/comments/create", commentsController.create);
router.patch("/comments/patch/:id", commentsController.patch);
router.delete("/comments/deleteOne/:id", commentsController.destroyOneById);
router.delete("/comments/deleteMany/:id",commentsController.deleteManyByPostId);
//inscriptions
router.delete("/inscription/deleteOne/:id", videosController.destroyOneById);

// backups
router.get("/backups/getAll", backupsController.getListFiles);
router.get("/backups/getLast", backupsController.getLastSavedBackup);
router.get("/backups/create/:dbName", backupsController.createBackupMongoDBFile);
router.get("/backups/restore/:fileName", backupsController.restoreMongoDB);
router.get("/backups/download/:fileName", backupsController.downloadBackupFile);
router.get("/backups/delete/:fileName", backupsController.removeBackupFile);
router.post("/customBackup/create", backupsController.createCustomBackupVideo);
router.get("/customBackup/restore/:fileName", backupsController.restoreCustomMongoDB);

router.get("/downloadExcel/:fileName",excelExamplsController.downloadExcelExamplesFile),

// download file
router.post('/download', function(req, res){
  try{
  const {path,fileName}=req.body
  const file = `${__dirname}${path}`;
  console.log("pathFile:",file)
  res.download(file,fileName); // Set disposition and send it.
  }catch(e){
next(e)
  }
});

module.exports = router;
