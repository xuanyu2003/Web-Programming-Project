// Import User
import { User } from "./class/User.js";
let user = new User();

// Get DOM
let email_input = document.querySelector("#email");
let errorMessage = document.querySelector("#error");
let btn = document.querySelector(".btn.btn-dark");

// Add Click Button Event
btn.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = email_input.value;

  if (!email) {
    error.style.display = "block";
    error.textContent = "Please type your email.";
    return;
  } else {
    error.style.display = "none";
  }

  try {
    const exists = await user.checkEmailExists(email);

    // text
    // const exists = false;
    // console.log(exists);

    if (exists) {
      // if exist, to reset2.html
      errorMessage.style.display = "none";
      window.location.href = "../reset2.html";
      // store email to local
      localStorage.setItem("email", email);
    } else {
      // if not exist, display error info
      let errorMessage = document.querySelector("#error");
      errorMessage.style.display = "block";
      errorMessage.textContent = "Email does not exist.";
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.style.display = "block";
    errorMessage.textContent = "An error occurred. Please try again later.";
  }
});
