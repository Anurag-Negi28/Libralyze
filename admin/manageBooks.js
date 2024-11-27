const prompt = require('prompt-sync')();
const fs = require('fs');

// Function to add a book
function addBook(libraryData) {
    const title = prompt("Enter book title: ");
    const author = prompt("Enter author: ");
    const genre = prompt("Enter genre: ");
    const year = prompt("Enter year: ");
    const quantity = parseInt(prompt("Enter quantity: "), 10);
    const isbn = prompt("Enter ISBN: ");

    if (!libraryData.has(isbn)) {
        libraryData.set(isbn, { title, author, genre, year, quantity });
        console.log("\nBook added successfully!");
    } else {
        console.log("\nBook with this ISBN already exists.");
    }
}

// Function to delete a book
function deleteBook(libraryData) {
    const isbn = prompt("Enter ISBN of the book to delete: ");

    if (libraryData.has(isbn)) {
        libraryData.delete(isbn);
        console.log("\nBook deleted successfully!");
    } else {
        console.log("\nBook with this ISBN does not exist.");
    }
}

function manageBooks(libraryData) {
    console.log("\n1. Add Book");
    console.log("2. Delete Book");
    const choice = prompt("Enter your choice (1-2): ");

    switch (choice) {
        case '1':
            addBook(libraryData);
            break;
        case '2':
            deleteBook(libraryData);
            break;
        default:
            console.log("\nInvalid choice. Returning to admin menu.");
    }
}

module.exports = manageBooks;
