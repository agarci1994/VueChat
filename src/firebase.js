import firebase from "@firebase/app";

require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
  apiKey: `${process.env.VUE_APP_APPKEY}`,
  authDomain: "chat-7e2d0.firebaseapp.com",
  databaseURL: "https://chat-7e2d0.firebaseio.com",
  projectId: "chat-7e2d0",
  storageBucket: "chat-7e2d0.appspot.com",
  messagingSenderId: "749381083413",
  appId: "1:749381083413:web:01c739618cb1b14288c91c",
  measurementId: "G-JH6HBFQ6W2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
