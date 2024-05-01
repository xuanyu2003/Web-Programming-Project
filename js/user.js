
import { User } from "../js/class/User.js";


const profile_email = document.querySelector('#profile-email')

const user = new User()
console.log(user.isLoggedIn)
console.log(user.email)
console.log("profile_email: " + profile_email)
console.log(user.id)


if(user.isLoggedIn) {
    // for testing
    console.log("user.username: " + user.username)
    console.log("user.email: " + user.email)
    profile_email.innerHTML = user.username +  "<br>"+ user.email;
} else {
}
