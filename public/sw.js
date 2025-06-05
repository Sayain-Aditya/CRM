self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon.png', // Optional: place an icon in /public/
  });
});
