import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

function getUserId(req: functions.https.Request): string | undefined {
  return (
    (req.body?.userId as string | undefined) ??
    (req.body?.id as string | undefined) ??
    (req.query.userId as string | undefined) ??
    (req.query.id as string | undefined)
  );
}

// Create a user with address subcollection
export const createUser = functions.https.onRequest(async (req, res) => {
  try {
    const { name, age, email, address } = req.body;

    if (!name || !age || !email || !address) {
      res.status(400).send("Missing fields");
      return;
    }

    // Add user to 'users' collection
    const userRef = await db.collection("users").add({
      name,
      age,
      email
    });

    // Add address to 'address' subcollection
    await userRef.collection("address").add(address);

    res.send({ message: "User created successfully", userId: userRef.id });
  } catch (error) {
    res.status(500).send(error);
  }
});

// http://127.0.0.1:5001/dev-ecom-test-010126/us-central1/createUser



// Get all users
export const getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users: any[] = [];
    snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});
// http://127.0.0.1:5001/dev-ecom-test-010126/us-central1/getUsers

// Get address for a user
export const getUserAddress = functions.https.onRequest(async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(400).send("Missing userId");
      return;
    }

    const addressSnapshot = await db.collection("users")
      .doc(userId)
      .collection("address")
      .get();

    const addresses: any[] = [];
    addressSnapshot.forEach(doc => addresses.push({ id: doc.id, ...doc.data() }));

    res.send(addresses);
  } catch (error) {
    res.status(500).send(error);
  }
});
// http://127.0.0.1:5001/dev-ecom-test-010126/us-central1/getUserAddress

// Update user info
export const updateUser = functions.https.onRequest(async (req, res) => {
  try {
    const userId = getUserId(req);
    
    // Get data from req.body.data or directly from req.body
    let data = req.body.data || req.body;
    
    // Remove userId/id keys so they don't get updated
    if (data) {
      data = { ...data };
      delete data.userId;
      delete data.id;
    }

    if (!userId || !data || Object.keys(data).length === 0) {
      res.status(400).send("Missing userId or update fields");
      return;
    }

    await db.collection("users").doc(userId).update(data);
    res.send({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});
// http://127.0.0.1:5001/dev-ecom-test-010126/us-central1/updateUser


// Delete user and their address subcollection
export const deleteUser = functions.https.onRequest(async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(400).send("Missing userId");
      return;
    }

    const userRef = db.collection("users").doc(userId);

    // Delete addresses first
    const addressSnapshot = await userRef.collection("address").get();
    const batch = db.batch();
    addressSnapshot.forEach(doc => batch.delete(doc.ref));
    batch.delete(userRef);
    await batch.commit();

    res.send({ message: "User and addresses deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});
// http://127.0.0.1:5001/dev-ecom-test-010126/us-central1/deleteUser





