import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAcDpB2-2C1Ulc3bTxdNonhcwMudcnX7f0",
  authDomain: "dropbox-clone-147df.firebaseapp.com",
  projectId: "dropbox-clone-147df",
  storageBucket: "dropbox-clone-147df.appspot.com",
  messagingSenderId: "110493119823",
  appId: "1:110493119823:web:a65404f935d1f4d1b0813a"
});


const firestore = firebase.firestore(app);

export const database = {
  folders: firestore.collection('folders'),
  files: firestore.collection('files'),
  formatDoc: doc => {
    return { id: doc.id, ...doc.data() }
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp
}

export const storage = firebase.storage()
export const auth = firebase.auth(app);
export default app
