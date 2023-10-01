import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, where, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBAKGwpzHfMUPKvye-YjOxer_XjWjjsjQ",
  authDomain: "coachlife-d6862.firebaseapp.com",
  projectId: "coachlife-d6862",
  storageBucket: "coachlife-d6862.appspot.com",
  messagingSenderId: "1041686554640",
  appId: "1:1041686554640:web:81e657887f1d724ce9c295",
  measurementId: "G-F8Y8PE1SJW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db,collection,addDoc, getDocs, where, query}
