const functions = require("firebase-functions");
const admin = require('firebase-admin');
const db = admin.firestore();


// Update thread reply count on create.
exports.replyCountCreate = functions.firestore
  .document('/reply/{replyId}')
  .onCreate((snap, context) => {
    const newReply  = snap.data();
    const threadRef = db.doc(`/thread/${newReply.thread}`);

    // First reply
    if(threadRef.count === undefined) {
      threadRef.update({count: 1}).then(result => {
        console.log(`Reply count updated for Thread: ${result.title}`);
      });
      return;
    }

    // Reply count exists
    let newCount = threadRef.count;
    newCount += 1;
    threadRef.update({count: newCount}).then(result => {
      console.log(`Reply count updated for Thread: ${result.title}`);
    });

  });

// Update thread reply count on delete.
exports.replyCountDelete = functions.firestore
  .document('/reply/{replyId}')
  .onDelete((snap, context) => {
    const deletedReply  = snap.data();
    const threadRef = db.doc(`/thread/${deletedReply.thread}`);

    // Decrease reply count
    let newCount = threadRef.count;
    newCount -= 1;
    threadRef.update({count: newCount}).then(result => {
      console.log(`Reply count updated for Thread: ${result.title}`);
    });

  });