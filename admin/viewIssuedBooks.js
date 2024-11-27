const fs = require('fs');
const path = require('path');

// Path to issued books data (adjust as per your shared data structure)
const issuedBooksPath = "../shared/issuedBooks.json";

function viewIssuedBooks() {
    try {
        const data = fs.readFileSync(issuedBooksPath, "utf-8");
        const issuedBooks = JSON.parse(data);

        if (issuedBooks.length === 0) {
            console.log("\nNo books are currently issued.");
        } else {
            console.log("\nCurrently Issued Books:");
            issuedBooks.forEach((entry, index) => {
                console.log(`\n${index + 1}.`);
                console.log(`Book Title: ${entry.title}`);
                console.log(`Issued To: ${entry.issuedTo}`);
                console.log(`Issue Date: ${entry.issueDate}`);
                console.log(`Due Date: ${entry.dueDate}`);
            });
        }
    } catch (error) {
        console.error("Error reading issued books data:", error);
    }
}

module.exports = viewIssuedBooks;
