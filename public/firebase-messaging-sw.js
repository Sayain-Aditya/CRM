importScripts(
  "https://www.gstatic.com/firebasejs/11.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.8.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBXpJ1dv_3SDq9TVa-_hoSoT4CFteNJsBM",
  authDomain: "hotel-buddha-avenue.firebaseapp.com",
  databaseURL: "https://hotel-buddha-avenue-default-rtdb.firebaseio.com",
  projectId: "hotel-buddha-avenue",
  storageBucket: "hotel-buddha-avenue.firebasestorage.app",
  messagingSenderId: "20353209537",
  appId: "1:20353209537:web:a6f748af3d97def3393040",
  measurementId: "G-7X3Z82HLB8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
