const fs = require('fs');
const path = require('path');

// File path for persistent storage
const filePath = path.join(__dirname, '../shared/libraryData.json');

// Load library data from JSON file
const loadLibraryData = () => {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Map(JSON.parse(data).map(([isbn, book]) => [isbn, book]));
};

let libraryData = loadLibraryData();

// Function to ask a question to the user
const askQuestion = (rl, query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Function to save updated library data to file
const saveLibraryData = () => {
    fs.writeFileSync(filePath, JSON.stringify(Array.from(libraryData.entries()), null, 2));
};

// Function to issue a book
const issueBook = async (rl) => {
    try {
        // Ask for the book title
        const bookTitleInput = await askQuestion(rl, 'Enter the book title: ');
        const bookTitle = bookTitleInput.trim().toLowerCase(); // Handle case sensitivity

        // Find the book by matching title in the map
        let foundBook = null;
        for (const [isbn, book] of libraryData) {
            if (book.title.toLowerCase() === bookTitle) {
                foundBook = { ...book, ISBN: isbn }; // Include ISBN with the book data
                break;
            }
        }

        if (foundBook) {
            console.log(`Book Details:`);
            console.log(`Title: ${foundBook.title}`);
            console.log(`Author: ${foundBook.author}`);
            console.log(`Genre: ${foundBook.genre}`);
            console.log(`Year: ${foundBook.year}`);
            console.log(`Quantity Available: ${foundBook.quantity}`);

            // Ask if the user wants to issue the book
            const response = await askQuestion(rl, 'Do you want to issue this book? (yes/no): ');

            if (response.toLowerCase() === 'yes') {
                if (foundBook.quantity > 0) {
                    // Issue the book
                    foundBook.quantity -= 1; // Decrease the quantity
                    libraryData.set(foundBook.ISBN, foundBook); // Update the map in-memory

                    const issueDate = new Date().toLocaleDateString(); // Get current date

                    console.log(`Book issued successfully on ${issueDate}`);
                    console.log(`Updated Quantity Available: ${foundBook.quantity}`);

                    // Save updated library data to file
                    saveLibraryData();
                } else {
                    console.log('Sorry, this book is currently out of stock.');
                }
            } else {
                console.log('Book issue canceled.');
            }
        } else {
            console.log('Book not found.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

module.exports = issueBook;
