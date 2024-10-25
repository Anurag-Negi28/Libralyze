// searchBooks.js
const SearchType = {
  ISBN: "ISBN",
  TITLE: "title",
  AUTHOR: "author",
  GENRE: "genre",
};

function searchBooks(searchType, searchQuery, booksData) {
  if (!searchType || !searchQuery || !booksData) {
    throw new Error(
      "Invalid input: searchType, searchQuery, and booksData are required."
    );
  }

  if (!Object.values(SearchType).includes(searchType)) {
    throw new Error(
      `Invalid search type: ${searchType}. Valid types are ${Object.values(
        SearchType
      ).join(", ")}.`
    );
  }

  const query = searchQuery.trim().toLowerCase();
  const results = [];

  booksData.forEach((book, isbn) => {
    const valueToSearch = book[searchType]?.toString().toLowerCase();
    if (valueToSearch && valueToSearch.includes(query)) {
      results.push(book);
    }
  });

  if (results.length === 0) {
    console.log("No matches found.");
  }

  return results;
}

module.exports = { searchBooks, SearchType };
