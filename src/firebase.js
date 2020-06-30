import app from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import 'firebase/auth'

const firebaseConfig = {
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

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.db = app.firestore();
    this.storage = app.storage();
    this.auth = app.auth()
  }
}

const firebase = new Firebase();

export default firebase;

