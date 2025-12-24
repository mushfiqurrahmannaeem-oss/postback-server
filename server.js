const express = require('express');
const admin = require('firebase-admin');
const app = express();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

app.get('/postback', async (req, res) => {
    const { userid, points, secret } = req.query;
    if (secret !== "MY_KEY_123") return res.status(401).send("Error");

    try {
        const userRef = db.ref(`users/${userid}/balance`);
        await userRef.transaction((current) => (current || 0) + parseInt(points));
        res.status(200).send("1"); 
    } catch (error) {
        res.status(500).send("0");
    }
});

app.listen(process.env.PORT || 3000);
