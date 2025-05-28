import admin from 'firebase-admin';
// Add your firebase service account key JSON file
import serviceAccount from './firebase-key.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;