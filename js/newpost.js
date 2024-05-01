// Import User
import { User } from "../js/class/User.js";
let user = new User();

// Get DOM
let title_input = document.querySelector("#titleInput");
let content_input = document.querySelector("#contentInput");
let error = document.querySelector("#error");
let postButton = document.querySelector("#postButton");
let file_input = document.querySelector('input[type=file]');

function handleFiles(files) {
  if (files.length === 0) {
      console.log('No file is selected');
      return;
  }

  let file = files[0];
  let fileNameDisplay = document.createElement('span'); // 创建一个span元素来显示文件名
  fileNameDisplay.textContent = file.name; // 设置文件名为span的内容
  fileNameDisplay.style.marginLeft = '10px'; // 设置左边距以稍微隔开文件名和icon

  let icon = document.querySelector('.icon'); // 获取icon元素
  if (icon.nextSibling) {
      icon.parentNode.removeChild(icon.nextSibling); // 如果已经有显示的文件名，先移除
  }
  icon.parentNode.insertBefore(fileNameDisplay, icon.nextSibling); // 在icon后面插入文件名显示
}

window.handleFiles = handleFiles;


postButton.addEventListener("click", async (event) => {
  event.preventDefault();

  if (!user.id) {
    console.error("User ID is undefined");
    error.textContent = "User not authenticated.";
    error.style.display = "block";
    return;
}

  if (!title_input.value || !content_input.value) {
    error.textContent = "Please enter the title and content.";
    error.style.display = "block";
    return;
  } else {
    error.style.display = "none";
  }

  const formData = new FormData();
  formData.append('title', title_input.value);
  formData.append('content', content_input.value);
  formData.append('user_id', user.id);
  if (file_input.files.length > 0) {
    formData.append('image', file_input.files[0]);
  }

  try {
    const result = await user.newPost(formData); // 调用 User 类的方法
    window.location.href = "../home.html"; // 成功后跳转到主页
  } catch (err) {
    console.error("Error creating post:", err);
    error.textContent = "Failed to post. Error: " + err.message;
    error.style.display = "block";
  }
});
