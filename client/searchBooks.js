// searchBooks.js

/**
 * Enum for search types
 * @readonly
 * @enum {string}
 */
const SearchType = {
  ISBN: "ISBN",
  TITLE: "title",
  AUTHOR: "author",
  GENRE: "genre",
};

/**
 * Function to search books in the library data
 * @param {string} searchType - The type of search ('ISBN', 'title', 'author', 'genre')
 * @param {string} searchQuery - The search query string
 * @param {Map<string, object>} booksData - The library data (HashMap with ISBN as key)
 * @returns {Array<object>} - Array of matching book objects
 */
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
