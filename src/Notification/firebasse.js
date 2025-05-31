// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBXpJ1dv_3SDq9TVa-_hoSoT4CFteNJsBM",
  authDomain: "hotel-buddha-avenue.firebaseapp.com",
  databaseURL: "https://hotel-buddha-avenue-default-rtdb.firebaseio.com",
  projectId: "hotel-buddha-avenue",
  storageBucket: "hotel-buddha-avenue.firebasestorage.app",
  messagingSenderId: "20353209537",
  appId: "1:20353209537:web:a6f748af3d97def3393040",
  measurementId: "G-7X3Z82HLB8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Generate FCM Token and return it
export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BPUx8bc9C7nNI8YimkhtdOwObTeeFRI1IkSNsstiZs-x-hrJQ6mibdA4SSWt_ElnBELWiBW3fEzD-_u5xPKcHCE",
      });
      console.log("Token generated:", currentToken);
      return currentToken;
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
      return null;
    }
  } else {
    console.log("Notification permission not granted.");
    return null;
  }
};

// Register service worker function for your app (call this in your React app)
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
    await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)
      console.log("Service Worker registered with scope:", registration.scope);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  } else {
    console.log("Service workers are not supported in this browser.");
    return null;
  }
};

export { messaging };
