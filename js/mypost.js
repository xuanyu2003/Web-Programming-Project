import { User } from "./class/User.js";
let user = new User();

import { Post } from "./class/Post.js";
const post = new Post();

// get username from local storage
const username = localStorage.getItem("username");

// check if get username successfully
if (!username) {
  console.error("Failed to get username from localStorage");
} else {
  // if success, continue to load posts
  loadUserPosts(username);
}

// get posts from current user
async function loadUserPosts(username) {
  try {
    const posts = await user.getPostsByUsername(username);
    renderUserPosts(posts);
  } catch (error) {
    console.error("An error occurred while loading user posts:", error);
  }
}

// // for test
// const posts = [
//   {
//     title: "title1",
//     time: "2024/4/9 20:00",
//     content: "content",
//     thumbnail: "./img/demo1.jpeg",
//     link: "post1.html",
//   },
//   {
//     title: "title2",
//     time: "2024/4/9 20:00",
//     content: "content",
//     link: "post2.html",
//   },
//   {
//     title: "title3",
//     time: "2024/4/9 20:00",
//     content:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, ullam neque, est laboriosam deleniti illo eligendi reprehenderit nam nostrum voluptatibus quam porro maiores ut nobis laborum. Corporis sint unde soluta.",
//     thumbnail: "./img/demo2.jpeg",
//     link: "post3.html",
//   },
//   {
//     title: "title4",
//     time: "2024/4/9 20:00",
//     content:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, ullam neque, est laboriosam deleniti illo eligendi reprehenderit nam nostrum voluptatibus quam porro maiores ut nobis laborum. Corporis sint unde soluta.",
//     thumbnail: "./img/demo3.jpeg",
//     link: "post4.html",
//   },
// ];

// 渲染用户发布的所有帖子到页面
function renderUserPosts(posts) {
  const postContainer = document.getElementById("postContainer");
  if (!postContainer) {
    console.error("Post container not found");
    return;
  }
  // 清空之前的内容
  postContainer.innerHTML = "";

  // 如果用户没有帖子，显示提示信息
  if (posts.length === 0) {
    const noPostMessage = document.createElement("p");
    noPostMessage.textContent = "You don't have posts.";
    postContainer.appendChild(noPostMessage);
    return;
  }

  // 按时间排序帖子
  posts.sort((a, b) => {
    // 将时间字符串转换为日期对象进行比较
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    return dateB - dateA; // 按时间降序排序
  });

  // 遍历帖子数组，并创建相应的帖子卡片
  posts.forEach((post) => {
    const postCard = createPostCard(post);
    postContainer.appendChild(postCard);
  });
}

// Create post card
function createPostCard(post) {
  // create card body
  const card = document.createElement("div");
  card.classList.add("card-body");

  // create container for title, time, and content
  const textContainer = document.createElement("div");
  textContainer.classList.add("text-container");

  // create title
  const title = document.createElement("h5");
  title.classList.add("card-title");
  title.textContent = post.title;

  // create time
  const time = document.createElement("p");
  time.classList.add("card-time");
  const formattedTime = formatTime(post.time); // 格式化时间
  const smallTime = document.createElement("small");
  smallTime.classList.add("text-body-secondary");
  smallTime.textContent = formattedTime;
  time.appendChild(smallTime);

  // create content
  const content = document.createElement("p");
  content.classList.add("card-text");
  let limitedContent = post.content.substring(0, 200); // Limit content to 200 characters
  if (post.content.length > 200) {
    limitedContent += "..."; // Append "..." if content exceeds 200 characters
  }
  content.textContent = limitedContent;

  // append title, time, and content to text container
  textContainer.appendChild(title);
  textContainer.appendChild(time);
  textContainer.appendChild(content);

  // append text container to card body
  card.appendChild(textContainer);

  // check if the post has an image
  if (post.image_name && post.image_name.trim() !== ""){
    const imageUrl = `server/public/images/${post.image_name}`; // 构建完整的图片路径
    const image = document.createElement("img");
    image.classList.add("card-image");
    image.setAttribute("src", imageUrl); // 设置图片的src属性为完整路径
    image.setAttribute("alt", "image");
    card.appendChild(image);
  
    // 添加图片加载事件处理程序
    image.onload = function() {
      console.log("Image loaded successfully");
    };
  
    // 添加图片加载错误事件处理程序
    image.onerror = function() {
      console.error("Error loading image. Check the image path and server configuration.");
    };
  }
  

  card.addEventListener("click", async function () {
    try {
      window.location.href = `postDetails.html?id=${post.post_id}`;
    } catch (error) {
      console.error("An error occurred while redirecting to post detail:", error);
    }
  });

  return card;
}


// 页面加载完成后，加载用户发布的所有帖子
window.addEventListener("load", function () {
  // Display loading message initially
  const loadingMessage = document.getElementById("loading-message");
  loadingMessage.style.display = "block";

  loadUserPosts(username);
  // renderUserPosts(posts);
});

// 格式化时间
function formatTime(timeString) {
  const date = new Date(timeString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}