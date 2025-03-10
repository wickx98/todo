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
  apiKey: "AIzaSyCmK8GoZROJz5K_qw8dBgkhrP6hJNh8c4A",
  authDomain: "todo-application-860b9.firebaseapp.com",
  projectId: "todo-application-860b9",
  storageBucket: "todo-application-860b9.firebasestorage.app",
  messagingSenderId: "328745097664",
  appId: "1:328745097664:web:740d7e95fe33c125c65025",
  measurementId: "G-CWRE4S9M90"

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