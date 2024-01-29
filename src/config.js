import { initializeApp } from "firebase/app";
import { getFirestore, Firestore,FieldValue,deleteField, collection, addDoc, getDocs, where, query, updateDoc, doc, getDoc, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage"; // Add this import

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
const storage = getStorage(app); // Add this line

export { db, storage, Firestore,FieldValue,deleteField,orderBy, collection, addDoc, getDocs, where, query, updateDoc, doc, getDoc, serverTimestamp, ref, uploadString, getDownloadURL,limit,  };
