const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Store service account key in environment variables

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = async (req, res) => {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ message: "Only DELETE requests are allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId are required!" });
  }

  try {
    const response = await admin.auth().deleteUser(userId);
    return res
      .status(200)
      .json({ message: "User deleted successfully!", response });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};
