const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Store service account key in environment variables

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { title, body, token, data } = req.body;

  if (!title || !body || !token) {
    return res
      .status(400)
      .json({ message: "Title, body, and token are required!" });
  }

  const message = {
    notification: {
      title,
      body,
    },
    token, // Replace with a device token
    data: data || null,
  };

  try {
    const response = await admin.messaging().send(message);
    return res
      .status(200)
      .json({ message: "Notification sent successfully!", response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res
      .status(500)
      .json({ message: "Failed to send notification", error: error.message });
  }
};
