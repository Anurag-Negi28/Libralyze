const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")(); // For input
const { adminDashboard } = require("../admin/adminDashboard"); // Import adminDashboard from adminDashboard.js
const clientDashboard = require("../client/clientDashboard"); // Import clientDashboard from clientDashboard.js

// Path to the users.json file
const usersFilePath = path.join(__dirname, "users.json");

// Function to read users from users.json
function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data); // parses JSON string to javascript object
  } catch (error) {
    console.error("Error reading user data:", error);
    return []; // Return an empty array if file doesn't exist
  }
}

// Function to write users to users.json
function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Write users to the file
  } catch (error) {
    console.error("Error writing user data:", error);
  }
}

// Function to validate the password
function isValidPassword(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password); // At least one uppercase letter
  const hasLowercase = /[a-z]/.test(password); // At least one lowercase letter
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least one special character
  const hasNumber = /[0-9]/.test(password); // Optional: At least one number

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasSpecialChar
  );
}

// Function to show the welcome screen
function showWelcomeScreen() {
  console.clear();
  console.log("Welcome to Libralyze!");
  console.log("1. Signup");
  console.log("2. Login");
  const choice = prompt("Enter your choice (1 or 2): "); // Use prompt-sync for input
  if (choice === "1") 
    signup();
  else if (choice === "2")
    login();
  else {
    console.log("Invalid choice. Please try again.");
    showWelcomeScreen();
  }
}

function signup() {
  console.clear();
  console.log("Signup Page");

  const username = prompt("Enter username: ");
  let password = prompt("Enter password: ");

  while (!isValidPassword(password)) {
    console.log(
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a special character."
    );
    password = prompt("Enter a valid password: ");
  }

  const role = prompt("Enter role (admin or client): ");

  // Basic validation
  if (!username || (role !== "admin" && role !== "client")) {
    console.log("Invalid input. Please try again.");
    return signup();
  }

  // Load existing users
  let users = readUsers();

  // Check if the username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    console.log("Username already exists. Please choose a different one.");
    prompt("Press Enter to return to the signup screen...");
    return signup(); // Prompt again for signup
  }

  // Add the new user
  users.push({ username, password, role });
  writeUsers(users);

  console.log("Signup successful!");
  showWelcomeScreen();
}

function login() {
  console.clear();
  console.log("Login Page");

  const username = prompt("Enter username: ");
  const password = prompt("Enter password: ");

  let users = readUsers();

  // Check if the user exists
  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    console.log("Invalid credentials. Please try again.");
    prompt("Press Enter to return to the welcome screen...");
    return showWelcomeScreen();
  }

  // Login successful
  console.log(`Login successful! Welcome, ${user.username}.`);

  // Redirect based on role
  if (user.role === "admin") 
    adminDashboard(user); 
  else if (user.role === "client") 
    clientDashboard(user); 
}

// Start the application
showWelcomeScreen();