import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyC9r3tuO7k8wJn9HJmXwQlObodQ1dbsHXs",
  authDomain: "tanzil-tgkd.firebaseapp.com",
  projectId: "tanzil-tgkd",
  storageBucket: "tanzil-tgkd.firebasestorage.app",
  messagingSenderId: "713350297757",
  appId: "1:713350297757:web:ac2e8042700f80e3c03c74",
  measurementId: "G-RMS0NVHYDX",
};
!firebase.apps.length ? firebase.initializeApp(config) : "";
export const db = firebase.firestore();
export const auth = firebase.auth();
