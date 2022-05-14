const functions = require("firebase-functions");
const admin = require('firebase-admin');
const db = admin.firestore();


// Update category thread count on create.
exports.threadCountCreate = functions.firestore
  .document('/thread/{threadId}')
  .onCreate(async(snap, context) => {
    const newThread  = snap.data();
    const categoryRef = db.doc(`/category/${newThread.category}`);
    const catDoc = await categoryRef.get()
    // First thread 
    if(catDoc.data().count === undefined || isNaN(catDoc.data().count)) {
      categoryRef.update({count: 1}).then(result => {
        console.log(`Thread count undefined || isNaN\nupdated for Category: ${newThread.category} -- count: ${catDoc.data().count}`);
      });
      return;
    }

    /* need to run emulator and try using postman to test functions */
    /* need to run emulator and try using postman to test functions */
    /* need to run emulator and try using postman to test functions */
    /* need to run emulator and try using postman to test functions */

    // Thread count exists
    let newCount = catDoc.data().count;
    console.log(`thread count exists. categoryRef.count: ${catDoc.data().count}`);
    newCount += 1;
    categoryRef.update({count: newCount}).then(result => {
      console.log(`Thread count updated for Category: ${newThread.category} - new count: ${newCount}`);
    });

  });

// Update category thread count on delete.
exports.threadCountDelete = functions.firestore
  .document('/thread/{threadId}')
  .onDelete(async(snap, context) => {
    const deletedThread  = snap.data();
    const categoryRef = db.doc(`/category/${deletedThread.category}`);
    const catDoc = await categoryRef.get()
    // Decrease thread count
    let newCount = catDoc.data().count;
    newCount -= 1;
    categoryRef.update({count: newCount}).then(result => {
      console.log(`Thread count updated for Category: ${deletedThread.category}`);
    });

    // Might as well remove the related replies
    // query replies where reply.thread === threadId
    const q = db.collection("reply").where("thread", "==", context.params.threadId);
    const qSnap = q.get();
    qSnap.then((response) => {
      response.docs.forEach((docD) => {
        docD.ref.delete();
      });
    })

  });