const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');
const libraryDataPath = "../shared/libraryData.json";


// Function to load book data from JSON file
function loadLibraryData() {
    try {
      const data = fs.readFileSync(libraryDataPath, "utf-8");
      const booksArray = JSON.parse(data); // Parse JSON array of arrays
      return new Map(booksArray); // Directly convert array of arrays to Map
    } catch (error) {
      console.error("Error loading library data:", error);
      return new Map();
    }
  }

// Load the initial library data
let libraryData = loadLibraryData();

function showAvailableBooks() {
    console.log("\nAvailable Books in the Library:");
    if (libraryData.size === 0) {
        console.log("No books available at the moment.");
    } else {
        libraryData.forEach((book, isbn) => {
            console.log(`\nTitle: ${book.title}`);
            console.log(`Author: ${book.author}`);
            console.log(`Genre: ${book.genre}`);
            console.log(`Year: ${book.year}`);
            console.log(`Quantity: ${book.quantity}`);
            console.log(`ISBN: ${isbn}`);
        });
    }
}

// Admin dashboard with menu options
function adminDashboard(user) {
    console.clear();
    console.log(`Welcome to the Admin Dashboard, ${user.username}.`);

    let adminChoice;

    do {
        console.log("\n1. View Available Books");
        console.log("2. View Currently Issued Books (Feature Coming Soon)");
        console.log("3. Add/Delete Books (Feature Coming Soon)");
        console.log("4. Logout");

        adminChoice = prompt("Enter your choice (1-4): ");

        switch (adminChoice) {
            case '1':
                showAvailableBooks();
                break;
            case '2':
                console.log("\nFeature to view currently issued books will be introduced later.");
                break;
            case '3':
                console.log("\nFeature to add or delete books will be introduced later.");
                break;
            case '4':
                console.log("\nLogging out...");
                break;
            default:
                console.log("Invalid choice. Please try again.");
        }
    } while (adminChoice !== '4');

    // Returning to welcome screen handled by index.js after admin logs out
}

module.exports = { adminDashboard };