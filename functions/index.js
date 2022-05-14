const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addUserToFirestore = functions.auth.user().onCreate((user) => {
  // when new user created, add user information to firestore
  const usersRef = admin.firestore().collection("users");
  let dispName;
  if(user.displayName === null){
    dispName = user.email;
  } else {
    dispName = user.displayName;
  }
  return usersRef.doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    displayName: dispName,
    profileImage: user.photoURL,
  });
});

/* letsgoapi */
// const letsgoapi = require("./api");
// exports.letsgoapi = letsgoapi.letsgoapi;

/* update thread count */
exports.threadCount = require("./thread-count");
/* update reply count */
exports.replyCount = require("./reply-count");
/* thread management */
exports.threadManagement = require("./thread-management");