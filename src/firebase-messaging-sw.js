import firebase from "firebase";

importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");
const config = {
  apiKey: "AIzaSyAJrNwmd6oK7H51QWLqwzFw-X72q_gGC4Q",
  authDomain: "hack-6c42a.firebaseapp.com",
  databaseURL: "https://hack-6c42a.firebaseio.com",
  projectId: "hack-6c42a",
  storageBucket: "hack-6c42a.appspot.com",
  messagingSenderId: "167776128050"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
