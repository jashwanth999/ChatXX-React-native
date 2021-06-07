import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyB2Z2vP12wV3-x1lX_ir56dhxNxAyyY-2g",
  authDomain: "whatsapp-48c08.firebaseapp.com",
  projectId: "whatsapp-48c08",
  storageBucket: "whatsapp-48c08.appspot.com",
  messagingSenderId: "1064813625541",
  appId: "1:1064813625541:web:76565ecd82dc34388f70ac",
  measurementId: "G-DLCE48D0S2"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth, storage };
