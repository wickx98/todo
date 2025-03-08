// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeJyqxqHZP_ABp6Rws473XBiiEaC2I3bE",
  authDomain: "todoapp-56b61.firebaseapp.com",
  projectId: "todoapp-56b61",
  storageBucket: "todoapp-56b61.firebasestorage.app",
  messagingSenderId: "412096505076",
  appId: "1:412096505076:web:db0db015a9273ee8ceeaa1",
  measurementId: "G-Z5NV8QEB1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics: Analytics = getAnalytics(app);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

// Export Firebase services for use in your app
export { app, analytics, db, auth, storage };