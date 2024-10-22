require("dotenv").config();
const app = require("./api/app");
const http = require("http").Server(app);
const io = require('socket.io')(http, {cors: {origin: "*"}});
const Notification = require('./api/models/notification.model'); 



const sockets = {};

io.on("connection", socket => {
  socket.on("connectInit", sessionId => {
    // The socket ID is stored along with the unique ID generated by the client
    sockets[sessionId] = socket.id
    // The sockets object is stored in Express so it can be grabbed in a route
    app.set("sockets", sockets)
    app.set("sessionId", sessionId)
  })
  console.log(`Client connected: ${socket.id}`)
})

// // The io instance is set in Express so it can be grabbed in a route
 app.set("io", io)
 

// Start the server
const startServer = (port) => {
  return new Promise((resolve, reject) => {
    http.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      resolve();
    });
  });
};

module.exports = {
  startServer,
  getIo: function() {
    return io;
  },
  // Function to watch for collection changes
  watchCollectionChanges: function() {
    const changeStream = Notification.watch();
    changeStream.on('change', (change) => {
      console.log('Change detected:', change);
      // Emit a Socket.io event when a change occurs
      io.emit('refresh', change); 
    });
  }
};