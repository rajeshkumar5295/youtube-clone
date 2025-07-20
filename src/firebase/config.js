import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDwcpqlBTk5PLNwQMvNoWgw01faN1aYheA",
    authDomain: "my-9f233.firebaseapp.com",
    projectId: "my-9f233",
    storageBucket: "my-9f233.firebasestorage.app",
    messagingSenderId: "118822024846",
    appId: "1:118822024846:web:905b159eb794a0078fbbdf",
    measurementId: "G-XMN18KXBSW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app; 
// project-118822024846