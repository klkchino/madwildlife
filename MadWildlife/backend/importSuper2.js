const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const readline = require("readline");

// Path to your Firebase service account key JSON
const serviceAccount = require("./src/main/resources/firebase-service-account.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Get first image URL from iNaturalist for a scientific name
 * @param {string} sciName
 * @returns {Promise<string>} image URL
 */
async function getImageFromiNaturalist(sciName) {
  try {
    // Skip if no scientific name
    if (!sciName || sciName.trim() === "") {
      return "";
    }

    const response = await axios.get(
      `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(sciName)}&rank=species`
    );
    
    if (response.data.results && response.data.results.length > 0) {
      const taxon = response.data.results[0];
      return taxon.default_photo?.medium_url || "";
    }
  } catch (err) {
    console.error(`Error fetching image for ${sciName}:`, err.message);
  }
  return "";
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Upload species from CSV to Firestore
 * @param {string} csvFilePath - path to CSV
 * @param {string} collectionName - "Flora" or "Fauna"
 */
async function uploadSpecies(csvFilePath, collectionName) {
  // Create a stream that skips the first line
  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;
  let csvContent = '';

  for await (const line of rl) {
    lineNumber++;
    // Skip the first line (title row)
    if (lineNumber === 1) {
      continue;
    }
    csvContent += line + '\n';
  }

  // Now parse the CSV content
  const rows = [];
  const { Readable } = require('stream');
  const stream = Readable.from([csvContent]);

  stream
    .pipe(csv())
    .on("data", (row) => {
      // Only add rows that have a scientific name (skip group headers)
      if (row["Scientific Name"] && row["Scientific Name"].trim() !== "") {
        rows.push(row);
      }
    })
    .on("end", async () => {
      try {
        const docRef = db.collection("superLogs").doc(collectionName);
        
        // Initialize the document with an empty species array if it doesn't exist
        await docRef.set({ species: [] }, { merge: true });

        console.log(`Processing ${rows.length} species...`);

        // Process sequentially and update DB incrementally
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const commonName = row["Common Name"] || "";
          const scientificName = row["Scientific Name"] || "";
          
          const imageUrl = await getImageFromiNaturalist(scientificName);
          
          // Store as an object instead of array
          const speciesEntry = {
            imageUrl: imageUrl,
            commonName: commonName,
            scientificName: scientificName
          };
          
          // Get current document
          const doc = await docRef.get();
          const currentSpecies = doc.data()?.species || [];
          
          // Append new species
          currentSpecies.push(speciesEntry);
          
          // Update Firestore with the updated array
          await docRef.set({ species: currentSpecies }, { merge: true });
          
          // Progress indicator
          if ((i + 1) % 10 === 0) {
            console.log(`Processed and uploaded ${i + 1}/${rows.length} species`);
          }
          
          // Wait 500ms between requests to respect rate limits
          await sleep(500);
        }

        console.log(`Completed uploading ${rows.length} species to ${collectionName}`);
      } catch (err) {
        console.error("Error uploading to Firestore:", err);
      }
    });
}

// Example usage
uploadSpecies("./OfficialWisconsinChecklistOnly.csv", "Fauna");
