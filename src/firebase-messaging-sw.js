import firebase from "firebase";

importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");
const config = {
  apiKey: "AIzaSyDy0F3-cJBQETE2kxRABluD-X-ekFEWm8k",
  authDomain: "hack-btsd.firebaseapp.com",
  databaseURL: "https://hack-btsd.firebaseio.com",
  projectId: "hack-btsd",
  storageBucket: "hack-btsd.appspot.com",
  messagingSenderId: "614557167245"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
