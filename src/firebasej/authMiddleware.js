import admin from "firebase-admin";

import "dotenv/config";

let serviceAccount = process.env.SECRET_GOOGLE;

serviceAccount = Buffer.from(serviceAccount, "base64").toString();
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
});

export async function getUid(idToken) {
  if (!idToken) return null;
  try {
    let res = await admin.auth().verifyIdToken(idToken);

    return res;
  } catch (error) {
    console.log("errorAdmin", error.message);
  }
}
