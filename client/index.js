const libraryData = require('../shared/book_data');
const readline = require('readline');
const issueBook = require('./bookIssue'); // Import issueBook function

// Create an interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
        libraryData.forEach((book) => {
            console.log(`\nTitle: ${book.title}`);
            console.log(`Author: ${book.author}`);
            console.log(`Genre: ${book.genre}`);
            console.log(`Year: ${book.year}`);
            console.log(`Quantity: ${book.quantity}`);
            console.log(`ISBN: ${book.ISBN}`);
        });
    }
}

// Function to handle the user's menu choice
function handleChoice(choice) {
    switch (choice) {
        case '1':
            showAvailableBooks();
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
                displayMenuPrompt(); // Show the menu again after action
            });
            return; // Return to prevent `displayMenuPrompt` from executing twice

        case '3':
            issueBook(rl).then(() => {
                displayMenuPrompt(); // Show the menu again after action
            }).catch(error => {
                console.error('An error occurred:', error);
                displayMenuPrompt(); // Show the menu again after action in case of error
            });
            return; // Return to prevent `displayMenuPrompt` from executing twice

        case '4':
            console.log('Exiting Libralyze. Have a readfull day!');
            rl.close();
            return;

        default:
            console.log('Invalid choice. Please select a valid option.');
            displayMenuPrompt(); // Show the menu again after action
            break;
    }
}

// Function to prompt user for menu input
function displayMenuPrompt() {
    displayMenu();
    rl.question('\nSelect an option: ', handleChoice);
}

// Start the program
displayMenuPrompt();
