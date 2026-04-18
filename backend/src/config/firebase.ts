import admin from "firebase-admin";
import { env } from "./env";

// Prevent re-initialization when module is loaded multiple times (e.g. dev hot reload)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newlines when the key is stored in .env
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("✅ Firebase Admin initialized");
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error);
  }
}

export default admin;
