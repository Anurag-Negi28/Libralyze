const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();  // For input

// Path to the users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Function to read users from users.json
function readUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);  // Return as an array of user objects
    } catch (error) {
        console.error("Error reading user data:", error);
        return [];  // Return an empty array if file doesn't exist
    }
}

// Function to write users to users.json
function writeUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));  // Write users to the file
    } catch (error) {
        console.error("Error writing user data:", error);
    }
}

// Function to show the welcome screen
function showWelcomeScreen() {
    console.clear();
    console.log("Welcome to Libralyze!");
    console.log("1. Signup");
    console.log("2. Login");
    const choice = prompt("Enter your choice (1 or 2): ");  // Use prompt-sync for input
    if (choice === '1') {
        signup();
    } else if (choice === '2') {
        login();
    } else {
        console.log("Invalid choice. Please try again.");
        showWelcomeScreen();
    }
}

// Function to handle user signup
function signup() {
    console.clear();
    console.log("Signup Page");

    const username = prompt("Enter username: ");
    const password = prompt("Enter password: ");
    const role = prompt("Enter role (admin or client): ");

    // Basic validation
    if (!username || !password || (role !== 'admin' && role !== 'client')) {
        console.log("Invalid input. Please try again.");
        return signup();
    }

    // Load existing users
    let users = readUsers();

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        console.log("Username already exists. Please choose a different one.");
        prompt("Press Enter to return to the signup screen...");
        return signup();  // Prompt again for signup
    }

    // Add the new user
    users.push({ username, password, role });
    writeUsers(users);

    console.log("Signup successful!");
    showWelcomeScreen();
}

// Function to handle user login
function login() {
    console.clear();
    console.log("Login Page");

    const username = prompt("Enter username: ");
    const password = prompt("Enter password: ");

    // Load existing users
    let users = readUsers();

    // Check if the user exists
    const user = users.find(user => user.username === username);

    // Check if the username or password is incorrect
    if (!user || user.password !== password) {
        console.log("Invalid credentials. Please try again.");
        prompt("Press Enter to return to the welcome screen..."); // Pausing for user input before returning
        return showWelcomeScreen();  // Returning to the welcome screen
    }

    // Login successful
    console.log(`Login successful! Welcome, ${user.username}.`);

    // Redirect based on role
    if (user.role === 'admin') {
        adminDashboard(user);
    } else if (user.role === 'client') {
        clientDashboard(user);
    }
}

// Admin dashboard
function adminDashboard(user) {
    console.clear();
    console.log(`Welcome to the Admin Dashboard, ${user.username}.`);
    // Add admin-specific operations here
}

// Client dashboard
function clientDashboard(user) {
    console.clear();
    console.log(`Welcome to the Client Dashboard, ${user.username}.`);
    // Add client-specific operations here
}

// Start the application
showWelcomeScreen();
