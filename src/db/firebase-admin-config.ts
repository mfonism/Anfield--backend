var admin = require("firebase-admin");

var serviceAccount = require("./../../secrets/firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

export default admin
