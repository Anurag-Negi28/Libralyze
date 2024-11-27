const prompt = require('prompt-sync')();
const fs = require('fs');
const viewIssuedBooks = require('./viewIssuedBooks');
const manageBooks = require('./manageBooks');
const path = require("path");

// Path to the library data JSON file
const libraryDataPath = path.join(__dirname, "..", "shared", "libraryData.json");


// Admin dashboard
function adminDashboard(user, libraryData) {
    console.clear();
    console.log(`Welcome to the Admin Dashboard, ${user.username}.`);

    let adminChoice;

    do {
        console.log("\n1. View Available Books");
        console.log("2. View Currently Issued Books");
        console.log("3. Add/Delete Books");
        console.log("4. Logout");

        adminChoice = prompt("Enter your choice (1-4): ");

        switch (adminChoice) {
            case '1':
                console.log("\nAvailable Books:");
                libraryData.forEach((book, isbn) => {
                    console.log(`\nTitle: ${book.title}, ISBN: ${isbn}`);
                });
                break;
            case '2':
                viewIssuedBooks();
                break;
            case '3':
                manageBooks(libraryData);
                break;
            case '4':
                console.log("\nLogging out...");
                break;
            default:
                console.log("Invalid choice. Please try again.");
        }
    } while (adminChoice !== '4');

    // Returning to welcome screen handled by index.js
}

module.exports = { adminDashboard };
