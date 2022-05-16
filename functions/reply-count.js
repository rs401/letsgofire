const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// Update thread reply count on create.
exports.replyCountCreate = functions.firestore
  .document("/reply/{replyId}")
  .onCreate(async (snap, context) => {
    const newReply = snap.data();
    const threadRef = db.doc(`/thread/${newReply.thread}`);
    const threadDoc = await threadRef.get();
    const updatedAt = newReply.createdAt;
    // First reply
    if (threadDoc.data().count === undefined) {
      threadRef.update({ count: 1, updatedAt: updatedAt }).then(() => {
        console.log(`Reply count updated`);
      });
      return;
    }

    // Reply count exists
    let newCount = threadDoc.data().count;
    newCount += 1;
    threadRef.update({ count: newCount, updatedAt: updatedAt }).then(() => {
      console.log(`Reply count updated`);
    });
  });

// Update thread reply count on delete.
exports.replyCountDelete = functions.firestore
  .document("/reply/{replyId}")
  .onDelete(async (snap, context) => {
    const deletedReply = snap.data();
    const threadRef = db.doc(`/thread/${deletedReply.thread}`);
    const threadDoc = await threadRef.get();
    // Decrease reply count
    let newCount = threadDoc.data().count;
    newCount -= 1;
    threadRef.update({ count: newCount }).then(() => {
      console.log(`Reply count updated`);
    });
  });
