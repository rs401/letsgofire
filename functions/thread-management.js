const functions = require("firebase-functions");
const admin = require('firebase-admin');
const Cors = require('cors');

const cors = Cors({origin: true});
const db = admin.firestore();

// Create thread
// exports.createThread = functions.https.onRequest((req, res) => {
//   cors(req, res, async() => {
//     try {
//       const newThread = await db.collection("/thread").add(req.body);
//       res.status(201).json({id: newThread.id});
//     } catch (err) {
//       console.log("error creating thread: ", err);
//       res.status(500).json({error: err});
//     }
//   });
// });

exports.createThread = functions.https.onCall((data, context) => {
  const newThread = db.collection("/thread").add(data);
  newThread.then((docRef) => {
    return {id: docRef.id};
  }).catch((err) => {
    console.log("error creating thread: ", err);
    return err;
  });
});

// // Read thread
// exports.readThread = functions.https.onRequest((req, res) => {
//   cors(req, res, async() => {

//   });
// });

// // Read all threads
// exports.readAllThreads = functions.https.onRequest((req, res) => {
//   cors(req, res, async() => {
    
//   });
// });

// // Update thread
// exports.updateThread = functions.https.onRequest((req, res) => {
//   cors(req, res, async() => {
    
//   });
// });

// // Delete thread
// exports.deleteThread = functions.https.onRequest((req, res) => {
//   cors(req, res, async() => {
    
//   });
// });