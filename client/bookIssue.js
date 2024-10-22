const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../shared/libraryData.json');

// Load library data from JSON file
const loadLibraryData = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const booksArray = JSON.parse(data);
        return new Map(booksArray); // Convert array of arrays to Map
    } catch (error) {
        console.error('Error loading library data:', error);
        return new Map();
    }
};

let libraryData = loadLibraryData(); // Load initial data

// Function to ask a question to the user
const askQuestion = (rl, query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Function to save updated library data to file
const saveLibraryData = (libraryData) => {
    const booksArray = Array.from(libraryData.entries()); // Convert map back to array of arrays
    fs.writeFileSync(filePath, JSON.stringify(booksArray, null, 2));
};

// Function to issue a book
const issueBook = async (rl) => {
    try {
        const bookTitleInput = await askQuestion(rl, 'Enter the book title: ');
        const bookTitle = bookTitleInput.trim().toLowerCase();

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

            const response = await askQuestion(rl, 'Do you want to issue this book? (yes/no): ');

            if (response.toLowerCase() === 'yes') {
                if (foundBook.quantity > 0) {
                    foundBook.quantity -= 1; // Decrease the quantity
                    libraryData.set(foundBook.ISBN, foundBook); // Update the map in-memory

                    const issueDate = new Date().toLocaleDateString();
                    console.log(`Book issued successfully on ${issueDate}`);
                    console.log(`Updated Quantity Available: ${foundBook.quantity}`);

                    // Save updated library data to file
                    saveLibraryData(libraryData); // Save to JSON
                    libraryData = loadLibraryData(); // Reload the updated library data
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
