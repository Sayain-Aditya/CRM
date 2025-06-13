import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBXjRhtr7xbTGTpuT07BJe_0QBvJSCq8_o",
  authDomain: "billing-eef2f.firebaseapp.com",
  databaseURL: "https://billing-eef2f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "billing-eef2f",
  storageBucket: "gs://hotel-buddha-avenue.firebasestorage.app",
  messagingSenderId: "528156471253",
  appId: "1:528156471253:web:a4bbd33b10a9ea4584575c",
  measurementId: "G-3S1MYDPFN5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 