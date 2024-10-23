const fs = require("fs");

function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function listIssuedBooks(username, issuedBooks) {
  return issuedBooks.records.filter(
    (record) => record.username === username && record.returnDate === null
  );
}

function returnBook(username, bookISBN, issuedBooks, libraryData) {
  // Update issuedBooks.json
  const issuedBook = issuedBooks.records.find(
    (record) =>
      record.username === username &&
      record.bookISBN === bookISBN &&
      record.returnDate === null
  );
  if (issuedBook) {
    issuedBook.returnDate = new Date().toISOString();
    issuedBook.count -= 1;
  }

  // Update libraryData.json
  const libraryBook = libraryData.find((book) => book[0] === bookISBN);
  if (libraryBook) {
    libraryBook[1].quantity += 1;
  }

  writeJSONFile("issuedBooks.json", issuedBooks);
  writeJSONFile("libraryData.json", libraryData);
}

function main(rl, callback) {
  rl.question("Enter your username: ", (username) => {
    const issuedBooks = readJSONFile("issuedBooks.json");
    const libraryData = readJSONFile("libraryData.json");

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
        if (bookIndex < 0 || bookIndex >= userBooks.length) {
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
              returnBook(username, bookISBN, issuedBooks, libraryData);
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
