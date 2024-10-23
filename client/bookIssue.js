const fs = require('fs');
const path = require('path');

// File paths for persistent storage
const libraryDataPath = path.join(__dirname, '../shared/libraryData.json');
const issuedBooksPath = path.join(__dirname, '../shared/issuedBooks.json');

// Load library data from JSON file
const loadLibraryData = () => {
    const data = fs.readFileSync(libraryDataPath, 'utf8');
    return new Map(JSON.parse(data).map(([isbn, book]) => [isbn, book]));
};

// Load issued books data from JSON file
const loadIssuedBooks = () => {
    if (fs.existsSync(issuedBooksPath)) {
        const data = fs.readFileSync(issuedBooksPath, 'utf8');
        return JSON.parse(data);
    }
    return { records: [] }; // Default structure if file doesn't exist
};

let libraryData = loadLibraryData();
let issuedBooksData = loadIssuedBooks();

// Function to ask a question to the user
const askQuestion = (rl, query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Function to save updated library data to file
const saveLibraryData = () => {
    fs.writeFileSync(libraryDataPath, JSON.stringify(Array.from(libraryData.entries()), null, 2));
};

// Function to save issued books data to file
const saveIssuedBooksData = () => {
    fs.writeFileSync(issuedBooksPath, JSON.stringify(issuedBooksData, null, 2));
};

// Function to issue a book
const issueBook = async (rl) => {
    try {
        // Ask for the book title
        const bookTitleInput = await askQuestion(rl, 'Enter the book title: ');
        const bookTitle = bookTitleInput.trim().toLowerCase(); // Handle case sensitivity

        // Ask for the username
        const username = await askQuestion(rl, 'Enter your username: ');

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

                    const issueDate = new Date().toISOString(); // Get current date in ISO format

                    console.log(`Book issued successfully on ${issueDate}`);
                    console.log(`Updated Quantity Available: ${foundBook.quantity}`);

                    // Save updated library data to file
                    saveLibraryData();

                    // Check if user has already issued this book
                    let userRecord = issuedBooksData.records.find(record =>
                        record.username === username && record.bookISBN === foundBook.ISBN
                    );

                    if (userRecord) {
                        // If user already issued this book, just increase the count
                        userRecord.count += 1;
                        userRecord.issueDate = issueDate; // Update issue date
                    } else {
                        // Create a new entry for the user
                        issuedBooksData.records.push({
                            username,
                            bookISBN: foundBook.ISBN,
                            issueDate,
                            returnDate: null,  // No return date yet
                            count: 1           // Set initial count to 1
                        });
                    }

                    // Save updated issued books data
                    saveIssuedBooksData();
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
