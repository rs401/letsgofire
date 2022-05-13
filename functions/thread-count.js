const functions = require("firebase-functions");
const admin = require('firebase-admin');
const db = admin.firestore();


// Update category thread count on create.
exports.threadCountCreate = functions.firestore
  .document('/thread/{threadId}')
  .onCreate((snap, context) => {
    const newThread  = snap.data();
    const categoryRef = db.doc(`/category/${newThread.category}`);

    // First thread 
    if(categoryRef.count === undefined) {
      categoryRef.update({count: 1}).then(result => {
        console.log(`Thread count updated for Category: ${result.name}`);
      });
      return;
    }

    // Thread count exists
    let newCount = categoryRef.count;
    newCount += 1;
    categoryRef.update({count: newCount}).then(result => {
      console.log(`Thread count updated for Category: ${result.name}`);
    });

  });

// Update category thread count on delete.
exports.threadCountDelete = functions.firestore
  .document('/thread/{threadId}')
  .onDelete((snap, context) => {
    const deletedThread  = snap.data();
    const categoryRef = db.doc(`/category/${deletedThread.category}`);

    // Decrease thread count
    let newCount = categoryRef.count;
    newCount -= 1;
    categoryRef.update({count: newCount}).then(result => {
      console.log(`Thread count updated for Category: ${result.name}`);
    });

  });