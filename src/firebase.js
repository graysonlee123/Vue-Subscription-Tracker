import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAFtkcQ9qrCMvG0O0Az4Ck6NH5GodZsk_E",
  authDomain: "subscription-tracker-1a4f4.firebaseapp.com",
  databaseURL: "https://subscription-tracker-1a4f4.firebaseio.com",
  projectId: "subscription-tracker-1a4f4",
  storageBucket: "subscription-tracker-1a4f4.appspot.com",
  messagingSenderId: "479254004750",
  appId: "1:479254004750:web:536fe8e85a2e2457b6285f",
  measurementId: "G-FZVHNE7NGJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
