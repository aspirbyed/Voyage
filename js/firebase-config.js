// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8_qzK8wtX29bywPdu9vOVxXap_7EtbcQ",
  authDomain: "voyage-towards-xmas.firebaseapp.com",
  projectId: "voyage-towards-xmas",
  storageBucket: "voyage-towards-xmas.firebasestorage.app",
  messagingSenderId: "876014185552",
  appId: "1:876014185552:web:60b4eabd048c3d2f2eb555",
  measurementId: "G-CQJG905GEE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, firebaseConfig };