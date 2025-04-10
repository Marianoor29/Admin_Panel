"use client";
import { useEffect } from 'react';
import { messaging } from '../../firebaseConfig'; 
import { getToken, onMessage } from 'firebase/messaging'; 
import axios from 'axios';

const NotificationSetup = () => {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if (typeof navigator !== "undefined" && 'serviceWorker' in navigator) {
        try {
          // Register the service worker
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered with scope:', registration.scope);

          // Request permission to show notifications
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted.');

            // Only get token if messaging is defined
            if (messaging) {
              const token = await getToken(messaging, {
                vapidKey: 'BB4sQl.....9R7yKuXmoQdt1OW-UhQ',
                serviceWorkerRegistration: registration
              });

              if (token) {
                console.log('FCM Token:', token);
                // Send the token to your server for later use
                saveFcmToken(token);
              } else {
                console.log('No registration token available.');
              }
            } else {
              console.log('Messaging is not initialized.');
            }
          } else {
            console.log('Unable to get permission to notify.');
          }
        } catch (err) {
          console.error('Error during service worker registration or notification permission:', err);
        }
      } else {
        console.log('Service Worker is not supported in this browser.');
      }
    };
    // Call the function to register service worker and request permission
    registerServiceWorker();

    // Handle incoming messages when the app is in the foreground
    if (messaging) {
      onMessage(messaging, (payload) => {
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: '/logo.png',
          data: {
            url: payload.data.navigationId === 'HelpMessage'
              ? `http://offerboat-admin.us-east-1.elasticbeanstalk.com/list/messages/${payload.data.messageId}`
              : 'http://offerboat-admin.us-east-1.elasticbeanstalk.com/',
          },
        };

        const notification = new Notification(notificationTitle, notificationOptions);
      });
    }

  }, []);

  // Function to save the FCM token to your backend
  const saveFcmToken = async (fcmToken) => {
    const userName = localStorage.getItem("userName"); // Retrieve the username from local storage

    if (userName) {
      try {
        const response = await axios.post('https://www.offerboats.com/team/update-fcm-token', {
          userName: userName,
          fcmToken: fcmToken,
        });
        console.log('FCM Token saved successfully:', response.data);
      } catch (error) {
        console.error('Error saving FCM token:', error);
      }
    } else {
      console.log('No userName found in local storage.');
    }
  };

  return null; // Since this component doesn't render anything
};

export default NotificationSetup;
