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
            console.log("\nCurrently Issued Books:");
            issuedBooks.forEach((entry, index) => {
                console.log(`\n${index + 1}.`);
                console.log(`Username: ${entry.username}`);
                console.log(`Book ISBN: ${entry.bookISBN}`);
                console.log(`Issue Date: ${new Date(entry.issueDate).toLocaleString()}`);
                console.log(`Return Date: ${entry.returnDate ? new Date(entry.returnDate).toLocaleString() : "Not Returned"}`);
                console.log(`Count: ${entry.count}`);
            });
        }
    } catch (error) {
        console.error("\nError reading issued books data:", error);
    }
}

module.exports = viewIssuedBooks;
