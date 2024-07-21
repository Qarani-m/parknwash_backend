import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCFHZJ9Oep6dGA4I-b6kmrV3qO-LwKxpsc",
    authDomain: "parknwash-16587.firebaseapp.com",
    projectId: "parknwash-16587",
    storageBucket: "parknwash-16587.appspot.com",
    messagingSenderId: "713632909354",
    appId: "1:713632909354:web:58c613f4b3b21001219b53",
    measurementId: "G-NGDG4BGYVL"
};

const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseapp);

export { db };