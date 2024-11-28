const fs = require('fs');
const path = require('path');

// Path to issued books data
const issuedBooksPath = "../shared/issuedBooks.json";

function viewIssuedBooks() {
    try {
        const data = fs.readFileSync(issuedBooksPath, "utf-8");
        const issuedBooksData = JSON.parse(data);

        // Check if "records" exists and is an array
        if (!issuedBooksData.records || !Array.isArray(issuedBooksData.records)) {
            console.log("\nError: Issued books data is not in the correct format.");
            return;
        }

        const issuedBooks = issuedBooksData.records;

        if (issuedBooks.length === 0) {
            console.log("\nNo books are currently issued.");
        } else {
            // Grouping issued books by username
            const groupedData = issuedBooks.reduce((result, book) => {
                if (!result[book.username]) {
                    result[book.username] = [];
                }
                result[book.username].push(book);
                return result;
            }, {});

            console.log("\nCurrently Issued Books:");
            let counter = 1;

            // Iterating through each user and displaying their issued books
            for (const [username, books] of Object.entries(groupedData)) {
                console.log(`\n${counter}. Username: ${username}`);
                books.forEach((book) => {
                    console.log(`   - Book ISBN: ${book.bookISBN}`);
                    console.log(`     Issue Date: ${new Date(book.issueDate).toLocaleString()}`);
                    console.log(`     Return Date: ${book.returnDate ? new Date(book.returnDate).toLocaleString() : "Not Returned"}`);
                    console.log(`     Count: ${book.count}`);
                });
                counter++;
            }
        }
    } catch (error) {
        console.error("\nError reading issued books data:", error);
    }
}

module.exports = viewIssuedBooks;
