import admin from './firebase.js';  

export const send_push_notification = async (fcm_token, title, body) => {
  const message = {
    token: fcm_token,
    notification: {
      title,
      body,
    }
  };
  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent push notification:', response);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};