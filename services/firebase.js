import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";

const config = {
  apiKey: "AIzaSyBcz35V8aOqeBjaxBG7jclE_k3PCOz0XjU",
  authDomain: "candidate-tanzil-islam.firebaseapp.com",
  projectId: "candidate-tanzil-islam",
  storageBucket: "candidate-tanzil-islam.appspot.com",
  messagingSenderId: "158052982597",
  appId: "1:158052982597:web:898f444117487a6703a82c",
};
!firebase.apps.length ? firebase.initializeApp(config) : "";
export const db = firebase.firestore();
export const auth = firebase.auth();
const analytics = getAnalytics(firebase.initializeApp(config));
