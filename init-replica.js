// intit replicaset in mongo container

rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "db:27017" }]  // "db" doit être le nom du service MongoDB dans votre fichier Docker Compose
  });
  