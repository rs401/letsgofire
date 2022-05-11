import {db} from "../firebase-config";
import { collection, doc, addDoc, setDoc, getDocs, getDoc, query, where, Timestamp } from "firebase/firestore";
// const catRef = collection(db,"category");

export const addCat = async (cat) => {
  try {
    await setDoc(doc(db, "category", cat), {name: cat});
  } catch (err) {
    console.log("error adding category: ", err);
  }
}

export const getCats = async () => {
  try {
    let catlist = [];
    const docs = await getDocs(collection(db, "category"))
    docs.forEach((cat) => {
      catlist.push(cat);
    });
    return catlist;
  } catch (err) {
    console.log("error getting all categories: ", err);
  }
}

export async function getThreads(catid) {
  try {
    let threadlist = [];
    const q = query(collection(db, "thread"), where("category", "==", catid));
    const snapshot = await getDocs(q);
    snapshot.forEach((data) => {
      threadlist.push(data)
    });
    return threadlist;
  } catch (err) {
    console.log("error getting threads: ", err);
  }
}

export async function createThread(t) {
  try {
    t.createdAt = Timestamp.now();
    t.updatedAt = Timestamp.now();
    let data = await addDoc(collection(db, "thread"), t);
    return data.id;
  } catch (err) {
    console.log("error adding thread: ", err);
  }
}

export async function getThread(threadId) {
  try {
    const docRef = doc(db, "thread", threadId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.log("error getting document: ", err);
  }
}

export async function getReplies(threadId) {
  try {
    let replylist = [];
    const q = query(collection(db, "reply"), where("thread", "==", threadId));
    const docs = await getDocs(q);
    docs.forEach((data) => {
      replylist.push(data)
    });
    return replylist;
  } catch (err) {
    console.log("error getting replies: ", err);
  }
}

export async function createReply(r) {
  try {
    r.createdAt = Timestamp.now();
    r.updatedAt = Timestamp.now();
    let data = await addDoc(collection(db, "reply"), r);
    return data.id;
  } catch (err) {
    console.log("error adding reply: ", err);
  }
}

export const getStates = () => {
  return ["AL","AK","AZ","AR","AS","CA","CO","CT","DE","DC","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","CM","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","TT","UT","VT","VA","VI","WA","WV","WI","WY"];
}