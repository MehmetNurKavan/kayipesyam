import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase yapılandırma objeniz
const firebaseConfig = {
    apiKey: "AIzaSyAt8I8AmqUauCNkc2Uz5mriqehCyIXvbv0",
    authDomain: "kayip-esyam.firebaseapp.com",
    projectId: "kayip-esyam",
    storageBucket: "kayip-esyam.appspot.com",
    messagingSenderId: "244173863408",
    appId: "1:244173863408:web:8b802b9bff24c39022c535",
    measurementId: "G-Q6WWNGGP3M"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore'u alın
const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

// Firebase yapılandırmasını ve Firestore'u dışa aktar
export { firebaseConfig, db, auth, storage };
