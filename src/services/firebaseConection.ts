
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBShSyIB-mbNg_oRtZeA8tPkBkH5mxzNmQ",
  authDomain: "plustask-cbc8a.firebaseapp.com",
  projectId: "plustask-cbc8a",
  storageBucket: "plustask-cbc8a.firebasestorage.app",
  messagingSenderId: "1011668507040",
  appId: "1:1011668507040:web:668289c86ddef3ae702cc5"
};


const firebaseapp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseapp)

export { db };