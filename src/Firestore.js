import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAJrNwmd6oK7H51QWLqwzFw-X72q_gGC4Q",
  authDomain: "hack-6c42a.firebaseapp.com",
  databaseURL: "https://hack-6c42a.firebaseio.com",
  projectId: "hack-6c42a",
  storageBucket: "hack-6c42a.appspot.com",
  messagingSenderId: "167776128050"
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
