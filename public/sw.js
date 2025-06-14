self.addEventListener("push", function (event) {
  console.log("Push event received:", event);
  const data = event.data.json();

  // Check if the notification is for a car
  if (data.type === "car") {
    self.registration.showCarNotification(`Service Reminder for ${data.name}`, {
      body: data.body,
      icon: "/public/icon.png", // Optional: Add an icon in the public folder
    });
  } else {
    // Handle other types of notifications (e.g., leads)
    self.registration.showNotification(`Follow-up Reminder for ${data.name}`, {
      body: data.body,
      icon: "/public/icon.png", // Optional: Add an icon in the public folder
    });
  }
});
