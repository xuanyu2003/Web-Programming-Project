// Import User
import { User } from "../js/class/User.js";
let user = new User();

// Get DOM
let username_input = document.querySelector("#username");
let email_input = document.querySelector("#email");
let password_input = document.querySelector("#password");
let confirmPassword_input = document.querySelector("#confirmPassword");
let error = document.querySelector("#error");
let btn = document.querySelector(".btn.btn-dark");

// Add keydown event listener to window
// window.addEventListener("keydown", function (event) {
//   if (event.key === "Enter") {
//     event.preventDefault();
//     btn.click(); // Trigger button click event
//   }
// });

btn.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = email_input.value;
  const username = username_input.value;
  const password = password_input.value;
  const confirmPassword = confirmPassword_input.value;

  try {
    // Check if email exists
    const emailExists = await user.checkEmailExists(email);
    if (emailExists) {
      error.style.display = "block";
      error.textContent = "Email already exists.";
      return;
    }

    // Check if username exists
    const usernameExists = await user.checkUsernameExists(username);
    if (usernameExists) {
      error.style.display = "block";
      error.textContent = "Username already exists.";
      return;
    }

    // Check if username input is empty
    if (!username) {
      // If username input is empty, display an error message
      error.style.display = "block";
      error.textContent = "Please enter your username.";
      return;
    } else {
      error.style.display = "none";
    }

    // Check if email input is empty
    if (!email) {
      // If email input is empty, display an error message
      error.style.display = "block";
      error.textContent = "Please enter your email address.";
      return;
    } else {
      error.style.display = "none";
    }

    // Check if password input is empty
    if (!password) {
      // If password input is empty, display an error message
      error.style.display = "block";
      error.textContent = "Please enter your password.";
      return;
    } else {
      error.style.display = "none";
    }

    // Verify Password
    if (password !== confirmPassword) {
      error.style.display = "block";
      error.textContent = "Passwords do not match.";
      return;
    }

    // Register User
    await user.signup(username, email, password);
    // Redirect to login page
    window.location.href = "../login.html";
  } catch (error) {
    // Handle any errors
    console.error(error);
    const errorMessage = document.getElementById("error");
    errorMessage.style.display = "block";
    errorMessage.textContent = "Invalid username or email.";
  }
});
