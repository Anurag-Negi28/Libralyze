# Libralyze

Libralyze is a library management system designed to streamline the process of issuing and returning books. It provides a user-friendly experience for both clients and administrators to efficiently manage library operations.

## Features

### Client Dashboard:

- **View Available Books**: Clients can browse the available books in the library.
- **Search Books**: Clients can search for books by ISBN, author, title, or genre.
- **Issue Books**: Clients can issue books directly from the system.
- **Return Books**: Clients can return previously issued books.

### Admin Dashboard:

- **Add New Books**: Admins can add new books to the library database.
- **Update Book Details**: Admins can update existing book information.
- **Remove Books**: Admins can remove outdated or unavailable books from the library.

## File Structure

- `client/`

  - `clientDashboard.js`: Manages client-specific operations (viewing, searching, issuing, returning books).
  - `bookIssue.js`: Contains logic to issue books to clients.
  - `bookReturn.js`: Handles book return logic.
  - `searchBooks.js`: Manages book searching functionality by ISBN, author, title, or genre.

- `admin/`

  - `adminDashboard.js`: Manages admin-specific operations (adding, updating, removing books).

- `shared/`

  - `libraryData.json`: Stores all book data, including ISBN, title, author, genre, year, and quantity.
  - `issuedBooks.json`: Stores data related to books that have been issued.
  - `returnedBooks.json`: Stores records of books that have been returned.

- `README.md`: Project documentation (this file).

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/libralyze.git
   cd libralyze
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Usage

### Start the Application:

Run the application and follow the on-screen prompts to sign up or log in. Based on your role (admin or client), you will be redirected to the appropriate dashboard.

### Client Operations:

- **View Available Books**:

  - Choose the option to view all available books from the client dashboard.

- **Search Books**:
  - Select the search option and choose from the available search criteria: ISBN, author, title, or genre.
- **Issue Books**:
  - Select the option to issue a book, then follow the prompts to complete the book issuance process.
- **Return Books**:
  - Choose the option to return a book and follow the instructions to complete the return process.

### Admin Operations:

- **Add New Books**:

  - Select the option to add a new book and fill in the required information such as ISBN, title, author, genre, and quantity.

- **Update Book Details**:
  - Choose the option to update book information and provide the updated details.
- **Remove Books**:
  - Select the option to remove a book from the library and confirm the action.

## Data Management

- **`libraryData.json`**:

  - This file contains an array of book objects with information such as ISBN, title, author, genre, year, and quantity.

- **`issuedBooks.json`**:

  - This file holds records of issued books with details like username, book ISBN, issue date, and return date.

- **`returnedBooks.json`**:
  - This file stores records of returned books with details like username, book ISBN, issue date, and return date.

## Contributing

Contributions to Libralyze are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push the changes to your branch.
5. Create a pull request to merge your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

By following this README, you should be able to install, run, and contribute to the Libralyze project with ease.
