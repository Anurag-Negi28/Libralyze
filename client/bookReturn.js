const fs = require("fs");

function readJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : { records: [] };
  } catch (error) {
    console.error(`Error reading JSON file at ${filePath}:`, error);
    return { records: [] };
  }
}

function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing JSON file at ${filePath}:`, error);
  }
}

function listIssuedBooks(username, issuedBooks) {
  return issuedBooks.records.filter(
    (record) => record.username === username && record.returnDate === null
  );
}

function returnBook(
  username,
  bookISBN,
  issuedBooks,
  libraryData,
  returnedBooks
) {
  // Find the issued book record
  const issuedBookIndex = issuedBooks.records.findIndex(
    (record) =>
      record.username === username &&
      record.bookISBN === bookISBN &&
      record.returnDate === null
  );
  if (issuedBookIndex !== -1) {
    const issuedBook = issuedBooks.records[issuedBookIndex];
    issuedBook.returnDate = new Date().toISOString();

    // Add to returnedBooks.json
    returnedBooks.records.push({
      username: issuedBook.username,
      bookISBN: issuedBook.bookISBN,
      issueDate: issuedBook.issueDate,
      returnDate: issuedBook.returnDate,
    });

    // Remove the returned book from issuedBooks.json
    issuedBooks.records.splice(issuedBookIndex, 1);
  } else {
    console.log(
      "Error: No matching issued book found or book already returned."
    );
    return;
  }

  // Update libraryData.json
  const libraryBook = libraryData.find((book) => book[0] === bookISBN);
  if (libraryBook) {
    libraryBook[1].quantity += 1;
  } else {
    console.log("Error: Book not found in library data.");
    return;
  }

  writeJSONFile("issuedBooks.json", issuedBooks);
  writeJSONFile("libraryData.json", libraryData);
  writeJSONFile("returnedBooks.json", returnedBooks);
}

function main(rl, callback) {
  rl.question("Enter your username: ", (username) => {
    const issuedBooks = readJSONFile("issuedBooks.json");
    const libraryData = readJSONFile("libraryData.json");
    const returnedBooks = readJSONFile("returnedBooks.json");

    const userBooks = listIssuedBooks(username, issuedBooks);
    if (userBooks.length === 0) {
      console.log("No books issued.");
      callback();
      return;
    }

    console.log("Books issued by you:");
    userBooks.forEach((book, index) => {
      const libraryBook = libraryData.find((b) => b[0] === book.bookISBN);
      console.log(
        `${index + 1}. ${libraryBook[1].title} (Issued on: ${new Date(
          book.issueDate
        ).toLocaleDateString()})`
      );
    });

    rl.question(
      "Enter the number of the book you want to return: ",
      (bookNumber) => {
        const bookIndex = parseInt(bookNumber) - 1;
        if (
          isNaN(bookIndex) ||
          bookIndex < 0 ||
          bookIndex >= userBooks.length
        ) {
          console.log("Invalid selection.");
          callback();
          return;
        }

        const bookISBN = userBooks[bookIndex].bookISBN;
        const libraryBook = libraryData.find((b) => b[0] === bookISBN);

        rl.question(
          `Are you sure you want to return "${libraryBook[1].title}"? (yes/no): `,
          (confirmation) => {
            if (confirmation.toLowerCase() === "yes") {
              returnBook(
                username,
                bookISBN,
                issuedBooks,
                libraryData,
                returnedBooks
              );
              const returnDate = new Date().toISOString();
              console.log(`Book "${libraryBook[1].title}" returned.`);
              console.log(
                `Issue Date: ${new Date(
                  userBooks[bookIndex].issueDate
                ).toLocaleDateString()}`
              );
              console.log(
                `Return Date: ${new Date(returnDate).toLocaleDateString()}`
              );
            } else {
              console.log("Return cancelled.");
            }
            callback();
          }
        );
      }
    );
  });
}

module.exports = main;
