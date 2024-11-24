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
      .status(200)
      .json({ message: "Only DELETE requests are allowed", status: 405 });
  }

  const { uid } = req.body;

  if (!uid) {
    return res
      .status(200)
      .json({ message: "Either UID is required!", status: 400 });
  }

  try {
    // Delete by UID if user exists
    try {
      const user = await admin.auth().getUser(uid);
      if (!user) {
        return res.status(200).json({
          devMessage: `User with UID ${uid} not found.`,
          message: `User not found.`,
          status: 404,
        });
      }
    } catch (error) {
      return res.status(200).json({
        devMessage: `User with UID ${uid} not found.`,
        message: `User not found.`,
        status: 404,
      });
    }

    await admin.auth().deleteUser(uid);
    return res.status(200).json({
      devMessage: `User with UID ${uid} deleted successfully.`,
      message: `User deleted successfully.`,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(200)
      .json({ message: "Failed to delete user", status: 500 });
  }
};
