// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCMoEI7v0KO-PzRDtDnyjyMNC4Eec9cXEg",
  authDomain: "snuggle-nest.firebaseapp.com",
  projectId: "snuggle-nest",
  storageBucket: "snuggle-nes.appspot.com",
  messagingSenderId: "1089649080408",
  appId: "1:1089649080408:ios:9133e2a2309f9666b8722d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { ref, uploadBytes, getDownloadURL, db, auth, storage };
