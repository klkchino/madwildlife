const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parser");
const fetch = require("node-fetch");

// Path to your Firebase service account key JSON
const serviceAccount = require("./src/main/resources/firebase-service-account.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Get first image URL from Animalia search for a scientific name
 * @param {string} sciName
 * @returns {Promise<string>} image URL
 */
async function getImageFromAnimalia(sciName) {
  try {
    const query = encodeURIComponent(sciName);
    const url = `https://animalia.bio/elastic-search?search=${query}`;
    const response = await fetch(url);
    const data = await response.json();

    // Example structure: data.results[0].imageUrl
    if (data && data.results && data.results.length > 0) {
      return data.results[0].imageUrl || "";
    }
  } catch (err) {
    console.error(`Error fetching image for ${sciName}:`, err);
  }
  return "";
}

/**
 * Upload species from CSV to Firestore
 * @param {string} csvFilePath - path to CSV
 * @param {string} collectionName - "Flora" or "Fauna"
 */
async function uploadSpecies(csvFilePath, collectionName) {
  const speciesArray = [];

  const rows = [];

  // First, read all rows into an array
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      try {
        // Map each row to a promise that fetches the image
        const fetchPromises = rows.map(async (row) => {
          const commonName = row["Common Name"] || "";
          const scientificName = row["Scientific"] || "";

          const imageUrl = await getImageFromAnimalia(scientificName);

          return [imageUrl, commonName, scientificName];
        });

        // Wait for all fetches to complete
        const speciesWithImages = await Promise.all(fetchPromises);

        // Save to Firestore
        const docRef = db.collection("superLogs").doc(collectionName);
        await docRef.set({ species: speciesWithImages }, { merge: true });

        console.log(`Uploaded ${speciesWithImages.length} species to ${collectionName}`);
      } catch (err) {
        console.error("Error uploading to Firestore:", err);
      }
    });
}

// Example usage
uploadSpecies("./OfficialWisconsinChecklistOnly.csv", "Fauna");
//uploadSpecies("./Fauna.csv", "Fauna");

