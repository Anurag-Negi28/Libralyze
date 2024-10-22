const fs = require('fs');
const readline = require('readline');
const issueBook = require('./bookIssue'); // Import issueBook function

// Path to your JSON file
const libraryDataPath = '../shared/libraryData.json';

// Create an interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to load book data from JSON file
function loadLibraryData() {
    try {
        const data = fs.readFileSync(libraryDataPath, 'utf-8');
        const booksArray = JSON.parse(data); // Parse JSON array of arrays
        return new Map(booksArray); // Directly convert array of arrays to Map
    } catch (error) {
        console.error('Error loading library data:', error);
        return new Map();
    }
}

// Function to save updated library data back to the JSON file
function saveLibraryData(libraryData) {
    const booksArray = Array.from(libraryData.entries()); // Convert map back to array of arrays
    fs.writeFileSync(libraryDataPath, JSON.stringify(booksArray, null, 2));
}

// Load the initial library data
let libraryData = loadLibraryData();

// Function to display the menu
function displayMenu() {
    console.log('\nLibralyze - Client Menu');
    console.log('1. Show Available Books');
    console.log('2. Search Book by ISBN');
    console.log('3. Issue Book');
    console.log('4. Exit');
}

// Function to display all available books
function showAvailableBooks() {
    console.log('\nAvailable Books in the Library:');
    if (libraryData.size === 0) {
        console.log('No books available at the moment.');
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

// Function to handle the user's menu choice
function handleChoice(choice) {
    switch (choice) {
        case '1':
            showAvailableBooks();
            displayMenuPrompt(); // After showing available books, show the menu again
            break;

        case '2':
            rl.question('\nEnter ISBN to search: ', (isbn) => {
                if (libraryData.has(isbn)) {
                    const book = libraryData.get(isbn);
                    console.log(`\nBook Found: ${book.title}`);
                    console.log(`Author: ${book.author}`);
                    console.log(`Genre: ${book.genre}`);
                    console.log(`Year: ${book.year}`);
                    console.log(`Quantity: ${book.quantity}`);
                } else {
                    console.log('Book not found.');
                }
                displayMenuPrompt(); // After searching, show the menu again
            });
            break;

        case '3':
            issueBook(rl).then(() => {
                displayMenuPrompt(); // After issuing a book, show the menu again
            });
            break;

        case '4':
            rl.close(); // Close the readline interface
            break;

        default:
            console.log('Invalid choice, please try again.');
            displayMenuPrompt(); // After invalid choice, show the menu again
            break;
    }
}

// Function to prompt the user for a menu option
function displayMenuPrompt() {
    displayMenu(); // Display the menu each time before asking for user input
    rl.question('\nEnter your choice (1-4): ', handleChoice);
}

// Start the program
displayMenuPrompt();
