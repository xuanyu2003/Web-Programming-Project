import { Posts } from "./class/Posts.js";

const posts = new Posts();

//17.Apr连接后端获取帖子
// 获取帖子
const getPosts = async () => {
  try {
    const postData = await fetch("http://localhost:3001/post/homepost");
    const postsData = await postData.json();
    await posts.readJson(postsData);
    renderPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// 渲染帖子
const renderPosts = async () => {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  const postsArray = await posts.getPosts();
  console.log("Posts Array:", postsArray);

  postsArray.forEach((post) => {
    console.log("Rendering post:", post);

    // 截取 post.content
    const shortenedContent = post.content.length > 200 ? post.content.substring(0, 200) + "..." : post.content;

    const postCard = document.createElement("div");
    postCard.classList.add("post-card");
    postCard.innerHTML = `
    <div class="post-details">
    <h2 class="post-title">${post.title}</h2>
    <div class="author-info">
      <img src="./img/demo5.png" alt="Author Avatar" class="author-avatar">
      <div class="author-details">
        <p class="author-name">@${post.author}</p>
        <p class="post-time">${post.formattedtime}</p>
      </div>
    </div>
    <p class="post-content">${shortenedContent}</p>
    </div>
    `;

 // 只有当 post.image_name 存在且不为空时，才添加图片元素
 if (post.image_name && post.image_name.trim() !== "") {
  // const imageContainer = document.createElement("div");
  // imageContainer.classList.add("image-container");

  const imageElement = document.createElement("img");
  imageElement.src = `server/public/images/${post.image_name}`;
  imageElement.alt = "Post image";
  imageElement.classList.add("post-image");
  
  // 将图片元素添加到帖子卡片中
  postCard.appendChild(imageElement);
}

 // 为帖子卡片添加点击事件监听器，跳转到详情页面
    postCard.addEventListener("click", async function () {
  
        window.location.href = `postDetails.html?id=${post.id}`;
      });
    
    postsContainer.appendChild(postCard);
  });
};

//调用函数
getPosts();

// 确保DOM完全加载后再添加事件监听器
document.addEventListener("DOMContentLoaded", (event) => {
  // 查询加号按钮
  const plusButton = document.querySelector(".navbar-toggler.mu-auto");

  // 为加号按钮添加点击事件监听器
  plusButton.addEventListener("click", function () {
    // 当加号按钮被点击时，跳转到 newpost.html
    window.location.href = "newpost.html";
  });
});