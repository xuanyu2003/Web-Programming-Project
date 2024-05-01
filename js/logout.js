import { User } from "./class/User.js"

const user = new User()

user.logout();

setTimeout(() => {
    //user.logout().then(() => {
    
    window.location.href = "index.html";
    //}).catch(error => {
    //    console.error("Logout error:", error);
    //});
}, 1500); 
