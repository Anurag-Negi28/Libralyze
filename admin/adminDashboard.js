const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")();
const { showWelcomeScreen } = require("../shared/index");
const viewIssuedBooks = require("./viewIssuedBooks");
const manageBooks = require("./manageBooks");

// Path to library data
const libraryDataPath = path.join(__dirname, "..", "shared", "libraryData.json");

// Load library data
function loadLibraryData() {
    try {
        const data = fs.readFileSync(libraryDataPath, "utf8");
        return JSON.parse(data); // Parse JSON file into a JavaScript object
    } catch (error) {
        console.error("Error reading library data:", error);
        return []; // If file doesn't exist or is corrupted, return an empty array
    }
}

// Admin Dashboard
function adminDashboard(user) {
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
            case "1": {
                // View available books
                const libraryData = loadLibraryData();

                if (libraryData.length === 0) {
                    console.log("\nNo books are available in the library.");
                } else {
                    console.log("\nAvailable Books:");
                    libraryData.forEach((entry, index) => {
                        // Access the second element of each pair to get book details
                        const book = entry[1];

                        // Safely access properties of the book object
                        const title = book.title || "Unknown Title";
                        const author = book.author || "Unknown Author";
                        const isbn = book.ISBN || "Unknown ISBN";

                        console.log(`\nBook ${index + 1}`);
                        console.log(`Title: ${title}`);
                        console.log(`Author: ${author}`);
                        console.log(`ISBN: ${isbn}`);
                    });
                }
                break;
            }
            case "2":
                // View issued books
                viewIssuedBooks();
                break;

            case "3":
                // Add/Delete books
                const libraryData = loadLibraryData();
                manageBooks(libraryData);
                break;

            case "4":
                console.log("\nLogging out...");
                showWelcomeScreen();
                break;

            default:
                console.log("Invalid choice. Please try again.");
        }
    } while (adminChoice !== "4");
}

module.exports = { adminDashboard };
