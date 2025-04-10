// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaS....Lgu2KqKdNk",
    authDomain: "offerboat-...seapp.com",
    projectId: "offerboat-54082",
    storageBucket: "offerboat-...ot.com",
    messagingSenderId: "455920054389",
    appId: "1:45592.....ac6083c",
    measurementId: "G-TNZJEY2DJZ"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' ,
    data: {
      url: payload.data.navigationId === 'HelpMessage' 
           ? `http://offerboat-admin.us-east-1.elasticbeanstalk.com/list/messages/${payload.data.messageId}` 
           : 'http://offerboat-admin.us-east-1.elasticbeanstalk.com/', 
  },
  
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification

  // Open the URL from the notification data
  event.waitUntil(
    clients.openWindow(event.notification.data.url) 
  );
});
