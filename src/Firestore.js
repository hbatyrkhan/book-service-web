import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDy0F3-cJBQETE2kxRABluD-X-ekFEWm8k",
  authDomain: "hack-btsd.firebaseapp.com",
  databaseURL: "https://hack-btsd.firebaseio.com",
  projectId: "hack-btsd",
  storageBucket: "hack-btsd.appspot.com",
  messagingSenderId: "614557167245"
};

firebase.initializeApp(config);

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("./firebase-messaging-sw.js")
//     .then(function(registration) {
//       console.log("Registration successful, scope is:", registration.scope);
//     })
//     .catch(function(err) {
//       console.log("Service worker registration failed, error:", err);
//     });
// }

export default firebase;
