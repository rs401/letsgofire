import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  signOut(auth);
};

export const currentUser = async (email) => {
  const usersRef = collection(db, "users");
  const userQuery = query(usersRef, where("email", "==", email));
  const querySnap = await getDocs(userQuery);
  querySnap.forEach((doc) => {
    if (doc.data().email === email) {
      return doc.data().displayName;
    }
  });
};

export const fetchUser = async (uid) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const userDoc = await getDocs(q);
    const data = userDoc.docs[0].data();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateUser = async (uid, profileImage, displayName) => {
  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      profileImage: profileImage,
      displayName: displayName,
    });
  } catch (err) {
    console.error(err);
    alert("An error occurred while fetching user data");
  }
};
