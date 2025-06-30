import admin from './firebase.js';  
import { apiLogger } from './util.js';

export const send_push_notification = async (fcm_token, user_id, title, body) => {
  const message = {
    token: fcm_token,
    notification: {
      title,
      body,
    }
  };
  try {
    const response = await admin.messaging().send(message);
    apiLogger.info('Push notification sent to user ID ' + user_id + ': ' + response);
  } catch (error) {
    apiLogger.error('Failed to send push notification to user ID ' + user_id + ': ' + error);
  }
};