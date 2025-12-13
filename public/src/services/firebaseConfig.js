import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCEBAaI0b1tAj2odqwECxpuUPp4viG9K_U",
    authDomain: "enterlist.firebaseapp.com",
    projectId: "enterlist",
    storageBucket: "enterlist.firebasestorage.app",
    messagingSenderId: "698296390619",
    appId: "1:698296390619:web:837d1d913290bb36ab0dfe",
    measurementId: "G-F685QB7QZG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);