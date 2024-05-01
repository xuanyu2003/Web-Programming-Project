import { User } from "./class/User.js";

//Get Dom elements
const user = new User();
const username_input = document.querySelector("#username");
const password_input = document.querySelector("#password");
const errorElement = document.querySelector("#error");

// Add keydown event listener to window
// window.addEventListener("keydown", function (event) {
//   if (event.key === "Enter") {
//     event.preventDefault();
//     document.querySelector("#login-button").click(); // Trigger button click event
//   }
// });

//login button event listener
document.querySelector("#login-button").addEventListener("click", (event) => {
  event.preventDefault();
  const username = username_input.value;
  const password = password_input.value;

  //return to homepage if login is successful
  user
    .login(username, password)
    .then((userInfo) => {
      window.location.href = "home.html";
      // store username to local
      localStorage.setItem("username", username);
    })
    .catch((LoginError) => {
      errorElement.style.display = "block";
      errorElement.textContent = "Username or password is incorrect.";
      console.error("Login error:", LoginError);
    });
});
