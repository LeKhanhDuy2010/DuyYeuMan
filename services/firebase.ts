
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * FIREBASE CONFIGURATION INSTRUCTIONS:
 * 
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Create a project and add a Web App.
 * 3. Copy the 'firebaseConfig' object and paste it below.
 * 4. Enable "Email/Password" authentication in the Auth section.
 * 5. Enable "Firestore Database" and create a 'settings' and 'memories' collection.
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// For development/production safety, we check if placeholders are still present
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { isConfigured };
