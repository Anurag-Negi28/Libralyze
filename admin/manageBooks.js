const fs = require("fs");
const path = require("path");
const prompt = require('prompt-sync')();

// Path to the library data JSON file
const libraryDataPath = path.join(__dirname, "..", "shared", "libraryData.json");

// Load library data from the JSON file
function loadLibraryData() {
    try {
        const data = fs.readFileSync(libraryDataPath, "utf-8");
        return new Map(JSON.parse(data)); // Convert array to Map
    } catch (error) {
        console.error("Error loading library data:", error);
        return new Map(); // Return an empty Map if loading fails
    }
}

// Save library data back to the JSON file
function saveLibraryData(libraryData) {
    try {
        if (libraryData instanceof Map) {
            const dataToSave = Array.from(libraryData.entries()); // Convert Map to array
            fs.writeFileSync(libraryDataPath, JSON.stringify(dataToSave, null, 2), "utf-8");
            console.log("Library data saved successfully.");
        } else {
            throw new TypeError("Invalid data type. Expected a Map object.");
        }
    } catch (error) {
        console.error("Error saving library data:", error);
    }
}

// Add a new book to the library
function addBook() {
    const libraryData = loadLibraryData();

    const isbn = prompt("Enter ISBN of the new book: ");
    if (libraryData.has(isbn)) {
        console.log(`A book with ISBN ${isbn} already exists.`);
        return;
    }

    const title = prompt("Enter the title of the book: ");
    const author = prompt("Enter the author of the book: ");
    const genre = prompt("Enter the genre of the book: ");
    const year = parseInt(prompt("Enter the publication year of the book: "), 10);
    const quantity = parseInt(prompt("Enter the quantity of the book: "), 10);

    libraryData.set(isbn, {
        ISBN: isbn,
        title,
        author,
        genre,
        year,
        quantity,
    });

    console.log(`Book "${title}" has been added successfully.`);
    saveLibraryData(libraryData);
}

// Delete an existing book from the library
function deleteBook() {
    const libraryData = loadLibraryData();

    const isbn = prompt("Enter ISBN of the book to delete: ");
    if (libraryData.has(isbn)) {
        libraryData.delete(isbn);
        console.log(`Book with ISBN ${isbn} has been deleted successfully.`);
        saveLibraryData(libraryData);
    } else {
        console.log(`No book found with ISBN ${isbn}.`);
    }
}

// Manage books menu
function manageBooks() {
    console.log("1. Add a Book");
    console.log("2. Delete a Book");

    const choice = prompt("Enter your choice (1-2): ");
    switch (choice) {
        case "1":
            addBook();
            break;
        case "2":
            deleteBook();
            break;
        default:
            console.log("Invalid choice. Please enter 1 or 2.");
    }
}

module.exports = manageBooks;
