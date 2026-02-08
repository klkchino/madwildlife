const fs = require("fs");
const csv = require("csv-parser");

// Check what columns are actually in your CSV
fs.createReadStream("./OfficialWisconsinChecklistOnly.csv")
  .pipe(csv())
  .on("data", (row) => {
    console.log("CSV Columns:", Object.keys(row));
    console.log("First row data:", row);
    process.exit(); // Exit after first row
  });
