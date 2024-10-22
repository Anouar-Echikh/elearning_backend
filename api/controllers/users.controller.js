const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
//var ns8ds = require("ns8-data-services");
//var IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");
//var GeolocationParams = require("ip-geolocation-api-javascript-sdk/GeolocationParams.js");
const Notification = require("../models/notification.model");
const bcrypt = require("bcryptjs");
const userController = {};

//var streamBuffers = require('stream-buffers');

/***
 * Sign up logic
 */

userController.register = async (req, res, next) => {
  const { name, email, password,role,level,image,connected,organization } = await req.body;
  

  //console.log(newUser);
  try {
    //get infoDevice from user request
   
        const foundUser = await User.findOne({ "local.email": email });
        if (foundUser) {
          res.send({ error: `L'email : " ${email} " est déjà utilisé` });
          next();
        } else {
          //create an object of new user information device
          // const newUser_infodevice = {
          //   ip: req.ip,
          //   organization: result.organization,
          //   geolocation: {
          //     continentCode: result.geolocation.continentCode,
          //     countryCode: result.geolocation.countryCode,
          //     countryName: result.geolocation.countryName,
          //     latitude: result.geolocation.latitude,
          //     longitude: result.geolocation.longitude,
          //     region: result.geolocation.region,
          //     regionName: result.geolocation.regionName,
          //     city: result.geolocation.city
          //   },
          //   browserVersion: result.browserVersion,
          //   browser: result.browser,
          //   deviceType: result.deviceType,
          //   platformVersion: result.platformVersion,
          //   platform: result.platform
          // };

          // Create a new user
          const newUser = new User({
            method: "local",
            local: {
              email,
              password
            },
            name,
            lastLogin: new Date(),
            connected:connected!=null?connected: true,//if user is added by admin, it should be not connected 
            //infoDevice: newUser_infodevice,
            role: role?role:"user",
            level:level?level:"",
            organization:organization?organization:"",
            image
          });

          //add new user
          const userAdded = await newUser.save();
          //for security we can define a new object and put inside it the values that we wante to send in the response
          // in this case i have removed the password from response
          const responseUser = {};
          responseUser.name = userAdded.local.name;
          responseUser.email = userAdded.local.email;
          responseUser._id = userAdded.local._id;

          //Generate the token
          const secret = process.env.JWT_SECRET;
          const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
          const token = jwt.sign({ _id: userAdded._id }, secret, {
            expiresIn: expiration
          });

          // Respond with token and user

          return res.send({ token });
        }
      
        //res.send({ errorGettingInfoDevice: "problem in getting infoDevice" });
      
    
  } catch (e) {
    next(e)
  }
};
userController.addUser = async (req, res, next) => {
  const { name, email, password,role,level,image,connected,phone } = await req.body;
  

  //console.log(newUser);
  try {
    //get infoDevice from user request
   
        const foundUser = await User.findOne({ "local.email": email });
        if (foundUser) {
          res.send({ error: `L'email : " ${email} " est déjà utilisé` ,success:false});
          next();
        } else {
          
          // Create a new user
          const newUser = new User({
            method: "local",
            local: {
              email,
              password
            },
            name,
            lastLogin: new Date(),
            connected:connected!=null?connected: true,//if user is added by admin, it should be not connected 
            //infoDevice: newUser_infodevice,
            role: role?role:"Etudiant",
            image,
            level,
            phone
          });

          //add new user
          const userAdded = await newUser.save();
          //for security we can define a new object and put inside it the values that we wante to send in the response
          // in this case i have removed the password from response
          

          
          return res.send({ success:true });
        }
      
        //res.send({ errorGettingInfoDevice: "problem in getting infoDevice" });
      
    
  } catch (e) {
    next(e);
  }
};
// patch user
userController.patch= async (req, res, next) => {
  let body = req.body;
let id = req.params.id;
  body={...body,lastUpdate:new Date()}
  try {
    const updatedUser = await User.updateOne(
      { _id: id },
      body
    );
    
    res.send({
      success: true,
      updatedUser
    });
  } catch (e) {
    next(e);
  }
};


userController.login = async (req, res, next) => {
  const { email, password, verifiedUser } = req.body;

  
 
  try {
       
        //check email and password
        const foundUser = await User.findOne({ "local.email": email });
        if (!foundUser) {
          // res.send({ error: `L'email : [${email}] n'existe pas dans le système.` });
          const error = new Error(
            `L'email : [${email}] n'existe pas dans le système.`
          );
          // error.status = 401;
          res.send({
            error: `L'email : [${email}] n'existe pas dans le système.`
          });
          //next(error);
          next();
        } else {
          foundUser.isPasswordMatch(
            password,
            foundUser.local.password,
            async (err, user) => {
              if (user) {
                //if credit ok ,then return jwt // or we can return jwt for free use (3 days - 30 d -90 d - ...) in registration

                const secret = process.env.JWT_SECRET;
                const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
                const token = jwt.sign({ _id: foundUser._id }, secret, {
                  expiresIn: expiration
                });

                
                //Check if this account is blocked by admin
                if (foundUser.blocked) {
                  res.status(401);
                  return res.send({
                    error: "Ce compte est bloqué, veuillez contacter l'admin!"
                  });
                } else {
                  // add date of user login
                  await User.updateOne(
                    { _id: foundUser._id },
                    {
                      $set: {
                        lastLogin: new Date(),
                        connected: true,

                        infoDevice: null
                      }
                    }
                  );
                  //-----end of adding date//

                  res.send({ token });
                }
              } else {
                //correct email & incorrect password
                res.send({
                  error: "Vérifier le mot de passe!"
                });
              }
            }
          );
        }
      
  } catch (e) {
    next(e);
  }
};

//unlock account by verifying password
userController.unlockUser = async (req, res, next) => {
  const { id, password } = req.body;

  try {
    //check email and password
    const foundUser = await User.findOne({ _id: id });
    if (foundUser.method === "local") {
      foundUser.isPasswordMatch(
        password,
        foundUser.local.password,
        async (err, user) => {
          if (user) {
            return res.send({ success: true });
          } else {
            return res.send({
              error: "Vérifier le mot de passe!",
              reqBody: req.body
            });
          }
        }
      );
    }

    if (foundUser.method === "facebook") {
      foundUser.isPasswordMatch(
        password,
        foundUser.facebook.password,
        async (err, user) => {
          if (user) {
            return res.send({ success: true });
          } else {
            return res.send({
              error: "Vérifier le mot de passe!"
            });
          }
        }
      );
    }
    if (foundUser.method === "google") {
      foundUser.isPasswordMatch(
        password,
        foundUser.google.password,
        async (err, user) => {
          if (user) {
            return res.send({ success: true });
          } else {
            return res.send({
              error: "Vérifier le mot de passe!",
              reqBody: req.body
            });
          }
        }
      );
    }
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Google OAuth
 *
 */

userController.googleOAuth = async (req, res, next) => {
  const {access_token:{profileObj,googleId  }} = req.body;
  var options = {
    accessToken: "",
    ip: req.ip,
    ua: req.headers["user-agent"],
    referrer: req.headers["referer"],
    url: req.hostname
  };
  try {
    //get infoDevice from user request
   
        const foundUser = await User.findOne({ "google.id": googleId });
        if (foundUser) {
          // Generate token

          const secret = process.env.JWT_SECRET;
          const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
          const token = jwt.sign({ _id: foundUser._id }, secret, {
            expiresIn: expiration
          });
          // add date of user login
          await User.updateOne(
            { _id: foundUser._id },
            {
              $set: {
                lastLogin: new Date(),
                connected: true,
                infoDevice: ""
              }
            }
          );
          //-----end of adding date//
          res.status(200).json({ token });
        }else{
// Create a new user
const newUser = new User({
  method: "google",
  google: {
    email:profileObj.email,
    password:"userGoogle"
  },
  name:profileObj.name,
  lastLogin: new Date(),
  connected: true,//if user is added by admin, it should be not connected 
  //infoDevice: newUser_infodevice,
  role: "user",
  level:"",
  organization:"",
  image:profileObj.imageUrl

});

//add new user
const userAdded = await newUser.save();
//for security we can define a new object and put inside it the values that we wante to send in the response
// in this case i have removed the password from response
const responseUser = {};
responseUser.name = userAdded.local.name;
responseUser.email = userAdded.local.email;
responseUser._id = userAdded.local._id;

//Generate the token
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
const token = jwt.sign({ _id: userAdded._id }, secret, {
  expiresIn: expiration
});
     
res.status(200).json({ token });

}
     
   
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Facebook OAuth
 *
 */

userController.facebookOAuth = async (req, res, next) => {
  const user = req.user;
  var options = {
    accessToken: "",
    ip: req.ip,
    ua: req.headers["user-agent"],
    referrer: req.headers["referer"],
    url: req.hostname
  };
  try {
    //get infoDevice from user request
    await ns8ds.score(options, async function(err, result) {
      if (!err && result) {
        const foundUser = await User.findOne({
          "facebook.id": user.facebook.id
        });
        if (foundUser) {
          // Generate token
          const secret = process.env.JWT_SECRET;
          const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
          const token = jwt.sign({ _id: foundUser._id }, secret, {
            expiresIn: expiration
          });

          // add date of user login
          await User.updateOne(
            { _id: foundUser._id },
            {
              $set: {
                lastLogin: new Date(),
                connected: true,
                infoDevice: result
              }
            }
          );
          //-----end of adding date//

          res.status(200).json({ token });
        }
      } //end if ns8ds
      else {
        res.send({ errorGettingInfoDevice: "Problem in getting infoDevice" });
      }
    }); // end fct ns8ds
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Get Current User
 *
 */

userController.currentUser =async (req, res, next) => {
  const { user } = req;
 
    res.send({ user });
   
};


userController.oneDriveOAuth = async (req, res, next) => {
   //const user = req.user;
   let body = req.body;
  // var options = {
  //   accessToken: "",
  //   ip: req.ip,
  //   ua: req.headers["user-agent"],
  //   referrer: req.headers["referer"],
  //   url: req.hostname
  // };
  try {
    
//     const foundUser = await User.findOne({
//       "onedrive.id": body.access_token.id
//     });
//     if (foundUser) {
//       // // Generate token
//       // const secret = process.env.JWT_SECRET;
//       // const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
//       // const token = jwt.sign({ _id: foundUser._id }, secret, {
//       //   expiresIn: expiration
//       // });

//       // add date of user login
//       await User.updateOne(
//         { _id: foundUser._id },
//         {
//           $set: {
//             lastLogin: new Date(),
//             connected: true,
//             token:body.access_token.accessToken
//            // infoDevice: result
//           }
//         }
//       );}else{
// // Create a new user
// const newUser = new User({
//   method: "onedrive",
//   local: {
//     email:body.access_token.userPrincipalName,
       
//   },
//   name:body.access_token.displayName,
//   lastLogin: new Date(),
//   connected: true,//if user is added by admin, it should be not connected 
//   //infoDevice: newUser_infodevice,
//   role:"Editeur",
//   token:body.access_token.accessToken
 
// });

//add new user
// const userAdded = await newUser.save();
// res.send({token:body.access_token.accessToken,userAdded});
//       }
    //   //-----end of adding date//
    
    //-------------------------------
  //list drivers
//   oneDriveAPI.items.listChildren({
//     accessToken: body.access_token.accessToken,
//     itemId: 'root',
//     drive: 'me', // 'me' | 'user' | 'drive' | 'group' | 'site'
//     driveId: '' // BLANK | {user_id} | {drive_id} | {group_id} | {sharepoint_site_id}
//   }).then((childrens) => {
//   // list all children of given root directory
//   //
//  //console.log(childrens);
//  res.status(200);
//  res.send({token:body.access_token.accessToken,childrens});
//   // returns body of https://dev.onedrive.com/items/list.htm#response
//   }).catch((error) => {
//     //console.log(error)
//     next(error)
//      //error.response.statusCode  => error code
//     // error.response.statusMessage => error message
//   })
    
 // }
   
       
    res.send({token:body.access_token.accessToken})
    // res.send({})
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Get Current User
 *
 */
 userController.currentUser = (req, res, next) => {
  const { user } = req;
  res.send({ user });
};
/***
 *
 * Get all users
 *
 */
userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.send({ users });
    } else {
      res.status(401);
      res.send({ error: "No users" });
    }
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Get user by email
 *
 */


userController.getUserByEmail = async (req, res, next) => {
  const email = req.params.email;
  try {
    const foundUser = await User.findOne({
      "local.email": email
    });
    //let arrOfAccount = foundUser; //because in usersReducer we have users:[] as state
    if (foundUser) {
      res.send({ account: foundUser });
    } else {
      res.send({
        error: `L'email : [${email}] n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};


userController.getUsersByListId = async (req, res, next) => {
  const {listUsersId,idOrg} = req.body;
  try {
var listProfs=[]
    for(let el of listUsersId){
    const foundUser = await User.findById(el._id);
    //let arrOfAccount = [foundUser]; //because in usersReducer we have users:[] as state
    if (foundUser) {
      listProfs.push({prof:foundUser,active:el.active})
    } 
    }
    if (listProfs.length > 0) {
      res.send({ users:listProfs });
    } else {
      res.send({ error: "No Profs for this Formation" });
    }
  } catch (e) {
    next(e);
  }
};










// Get user by Id

userController.getUserById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundUser = await User.findOne({
      _id: id
    });
    //let arrOfAccount = [foundUser]; //because in usersReducer we have users:[] as state
    if (foundUser) {
      res.send({ account: foundUser });
    } else {
      res.send({
        error: `Ce compte n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get user by CINPass

userController.getUserByCINPAss = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundUser = await User.findOne({
      cin: id
    });
    //let arrOfAccount = [foundUser]; //because in usersReducer we have users:[] as state
    if (foundUser) {
      res.send({ account: foundUser });
    } else {
      res.send({
        error: `Ce compte n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};
/***
 *
 * Delete user
 *
 */
userController.destroy = async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    await User.deleteOne({ _id: user_id });
    return res.send({
      success: true,
      message: "User deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Update user
 *
 */
userController.update = async (req, res, next) => {
  const body = req.body;
  const user_id = req.params.user_id;
  let updatedUser = {};
  try {
    const userToUpdate = await User.findById(user_id);
    if ("email" in body && userToUpdate.method === "local") {
      updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            "local.email": body.email,
            lastUpdate: new Date()
          }
        }
      );
    }
    if ("connected" in body) {
      updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            connected: body.connected,
            lastUpdate: new Date()
          }
        }
      );
    }
    if ("blocked" in body) {
      updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            blocked: body.blocked,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("phone" in body) {
      updatedUser = await User.updateOne(    
        { _id: user_id },
        {
          $set: {
            phone: body.phone,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("adress" in body) {
      updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            adress: body.adress,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("name" in body) {
      updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            name: body.name,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("role" in body) {
      updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            role: body.role,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("img" in body) {
      updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            img: body.img,

            lastUpdate: new Date()
          }
        }
      );
    }

    if (updatedUser.ok === 1) {
      res.send({
        success: true
      });
    } else {
      res.send({
        success: false,
        error: "Problème de mis à jour"
      });
    }
  } catch (e) {
    next(e);
  }
};

//Update password
userController.updatePassword = async (req, res, next) => {
  const { password, id } = req.body;

  try {
    const userToUpdate = await User.findById(id);
    //Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(password, salt);

    if (userToUpdate.method === "local") {
      const a = (updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: {
            "local.password": cryptedPassword,
            lastUpdate: new Date()
          }
        }
      ));
      if (a.ok === 1) {
        return res.send({
          success: true
        });
      } else {
        return res.send({
          success: false,
          error: "Problème de mis à jour"
        });
      }
    }
    if (userToUpdate.method === "google") {
      const a = (updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: {
            "google.password": cryptedPassword,
            lastUpdate: new Date()
          }
        }
      ));
      if (a.ok === 1) {
        return res.send({
          success: true
        });
      } else {
        return res.send({
          success: false,
          error: "Problème de mis à jour"
        });
      }
    }
    if (userToUpdate.method === "facebook") {
      const a = (updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: {
            "facebook.password": cryptedPassword,
            lastUpdate: new Date()
          }
        }
      ));
      if (a.ok === 1) {
        return res.send({
          success: true,
          returnedObject: a
        });
      } else {
        return res.send({
          success: false,
          error: "Problème de mis à jour"
        });
      }
    }
  } catch (e) {
    next(e);
  }
};

userController.logOut = async (req, res, next) => {
  const user_id = req.user._id;

  try {
    const updatedUser = await User.updateOne(
      { _id: user_id },
      { $set: { connected: false } }
    );

    return res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

//upload image avatar
userController.uploadImg = async (req, res, next) => {
  if (req.file) {
    res.send({ imgUpload: true });
    //res.json(req.file);
  } else res.send({ imgUpload: true });
};

module.exports = userController;
