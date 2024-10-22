const { startServer, getIo, watchCollectionChanges } = require("./index2");
const PORT = process.env.PORT || 5032;

startServer(PORT)
  .then(() => {
    const io = getIo();
    // Now you can use io for Socket.io functionality
    watchCollectionChanges(); // Start watching for collection changes
  })
  .catch(error => {
    console.error("Failed to start the server:", error);
  });
