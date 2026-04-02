import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore(admin.app());
// const db = getFirestore(admin.app(), "practice-db");

 
// Create a new user

export const createUsers = functions.https.onRequest( async (req, res) => {
  try {
    const data = req.body;

    const docRef = await db.collection("users").add(data);

    res.status(201).json({
      id: docRef.id,
      message: "User created successfully"
    });
  } catch (error) {
    res.status(500).json ({error: (error as Error).message });
  }
});

// firebase deploy --only functions -> it is used to deploy the functions to firebase cloud functions. After deploying, you can access the functions using the provided URLs.

// https://us-central1-dev-ecom-test-010126.cloudfunctions.net/createUsers

/* using curl method

 curl -X POST "https://us-central1-dev-ecom-test-010126.cloudfunctions.net/createUsers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul",
    "email": "rahul@example.com",
    "age": 25
  }'

*/


// Get all users

export const getUsers = functions.https.onRequest( async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json ({error: (error as Error).message });
  }
});
// https://us-central1-dev-ecom-test-010126.cloudfunctions.net/getUsers



// Get a user by ID

export const getUserById = functions.https.onRequest( async (req, res) => {
  try {
    const userId = req.query.id as string;
    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json ({error: (error as Error).message });
  }
});
// https://us-central1-dev-ecom-test-010126.cloudfunctions.net/getUserById?id=ItkPBjQOiWzTYDvhnIfY


// Update a user by ID

export const updateUserById = functions.https.onRequest( async (req, res) => {
  try {
    const userId = req.query.id as string;
    const data = req.body;
    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await docRef.update(data);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json ({error: (error as Error).message });
  }
});
// https://us-central1-dev-ecom-test-010126.cloudfunctions.net/updateUserById?id=SIjI6srknbJiWWhL7Wdp


// Delete a user by ID

export const deleteUserById = functions.https.onRequest( async (req, res) => {
  try {
    const userId = req.query.id as string;
    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await docRef.delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json ({error: (error as Error).message });
  }
});
// https://us-central1-dev-ecom-test-010126.cloudfunctions.net/deleteUserById?id=Ng3CVoF5soRJgZaHl6ne


// emulator -> firebase emulators:start --only functions,firestore -> start both emulators.

export const addUser = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body;          // { "name": "...", "email": "...", ... }
    const docRef = await db.collection("users").add(data);
    res.status(201).json({ id: docRef.id, message: "User created in emulator" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// for emulaltors URl 
// http://127.0.0.1:5001/dev-ecom-test-010126/us-central1/addUser
