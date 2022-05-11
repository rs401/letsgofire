const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addUserToFirestore = functions.auth.user().onCreate((user) => {
  // when new user created, add user information to firestore
  const usersRef = admin.firestore().collection("users");
  return usersRef.doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    profileImage: user.photoURL,
  });
});

/* letsgoapi */
// const letsgoapi = require("./api");
// exports.letsgoapi = letsgoapi.letsgoapi;