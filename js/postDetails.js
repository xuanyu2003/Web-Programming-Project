import { Post } from "./class/Post.js";
const post = new Post();

import { User } from "./class/User.js";
const user = new User();

// 获取 URL 中的查询参数
const urlParams = new URLSearchParams(window.location.search);
// 从查询参数中获取帖子的 ID
const postId = urlParams.get('id');
// for test 
// console.log(postId);

// 获取页面上用于显示帖子详细内容的元素
const postDetailContainer = document.querySelector('.postDetailContainer');
let postDetailElement; // 保存帖子详情元素的引用
const commentsContainer = document.querySelector(".comments");
const likeButton = document.querySelector(".like-button");
const likeCountElement = document.getElementById("like-count");


// load whole page, including post details and comments
async function loadPostDetails(id) {
    try {
        const postDetail = await post.fetchPostDetails(id);
        // 如果帖子详情元素已经存在，则替换内容，否则创建新的帖子详情元素
        if (postDetailElement) {
            // 替换帖子内容
            const newPostDetailElement = createPostElement(postDetail);
            
            postDetailContainer.replaceChild(newPostDetailElement, postDetailElement);
            postDetailElement = newPostDetailElement; // 更新帖子详情元素的引用
        } else {
            // 创建新的帖子详情元素
            postDetailElement = createPostElement(postDetail);
            postDetailContainer.appendChild(postDetailElement);
        }

        // get comments from database
        let comments = postDetail.comments;
        // sort by time from old comments to new comments
        comments.sort((a, b) => new Date(a.time) - new Date(b.time));
        comments.forEach(comment => {
            // put comments into comments container
            const commentElement = createCommentElement(comment);
            commentsContainer.appendChild(commentElement);
        });

        //get like numbers from database
        let likeNumber = postDetail.like_count;
        if(likeNumber==null){
            likeNumber=0;
        } 
        likeCountElement.textContent = likeNumber;
        
        // load like button
        setupLikeButton();
    } catch (error) {
        console.error("An error occurred while loading post details:", error);
    }
}

// Create post details element
function createPostElement(postDetail) {
    const postDetailElement = document.createElement("div");
    postDetailElement.classList.add("post-detail");

    const titleElement = document.createElement("h2");
    titleElement.classList.add("post-title");
    titleElement.textContent = postDetail.title;

    const authorElement = document.createElement("p");
    authorElement.classList.add("post-author");
    authorElement.textContent = "@" + postDetail.username;

    const savedElement = document.createElement("p");
    savedElement.classList.add("post-saved");
    savedElement.textContent = formattedTime(postDetail.time);

    const contentElement = document.createElement("p");
    contentElement.classList.add("post-content");
    contentElement.textContent = postDetail.content;

    const pictureElement = document.createElement("img");
    pictureElement.classList.add("post-image");

    // pictureElement.onload = function() {
    //     console.log("Image loaded successfully");
    // };
    // pictureElement.onerror = function() {
    //     console.error("Error loading image. Check the image path and server configuration.");
    // };
    

    // display delete & edit icon of current post if logged user is who create this post
    if (postDetail.username === user.username) {
        // create edit icon element
        const postEditElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        postEditElement.classList.add("icon");
        postEditElement.setAttribute('id', 'edit-icon');
        postEditElement.setAttribute('t', '1713894743538');
        postEditElement.setAttribute('viewBox','0 0 1024 1024');
        postEditElement.setAttribute('version', '1.1');
        postEditElement.setAttribute('p-id', '4303');
        postEditElement.setAttribute('width', '20px');
        // insert edit SVG code into SVG element
        const editSvgCode = `<path d="M783.673469 929.959184H177.632653c-45.97551 0-83.591837-37.616327-83.591837-83.591837V240.326531c0-45.97551 37.616327-83.591837 83.591837-83.591837h407.510204c11.493878 0 20.897959 9.404082 20.897959 20.897959s-9.404082 20.897959-20.897959 20.897959H177.632653c-22.987755 0-41.795918 18.808163-41.795918 41.795919v606.040816c0 22.987755 18.808163 41.795918 41.795918 41.795918h606.040816c22.987755 0 41.795918-18.808163 41.795919-41.795918V438.857143c0-11.493878 9.404082-20.897959 20.897959-20.897959s20.897959 9.404082 20.897959 20.897959v407.510204c0 45.97551-37.616327 83.591837-83.591837 83.591837z" fill="#bfbfbf" p-id="4304"></path><path d="M498.938776 563.722449c-9.926531 0-19.330612-4.179592-27.167347-11.493878-11.493878-11.493878-14.628571-28.212245-7.836735-42.840816l31.346939-66.873469c9.926531-21.420408 23.510204-40.75102 39.706122-56.946939l272.718367-272.718367c26.644898-26.644898 72.097959-25.6 100.310205 3.134693 28.734694 28.734694 29.779592 73.665306 3.134693 100.310205l-272.718367 272.718367c-16.718367 16.718367-35.526531 29.779592-56.946939 39.706122l-66.873469 31.346939c-5.22449 2.612245-10.44898 3.657143-15.673469 3.657143zM854.726531 135.836735c-6.791837 0-13.061224 2.612245-17.763266 7.314285L564.244898 415.346939c-13.061224 13.061224-23.510204 28.212245-31.346939 44.930612l-27.167347 57.469388 57.469388-27.167347c16.718367-7.836735 31.869388-18.285714 44.930612-31.346939l272.718368-272.718367c4.702041-4.702041 7.314286-11.493878 6.791836-19.330613-0.522449-8.359184-4.179592-16.195918-9.92653-21.942857-6.269388-6.269388-14.106122-9.926531-21.942857-9.92653-0.522449 0.522449-0.522449 0.522449-1.044898 0.522449z" fill="#bfbfbf" p-id="4305"></path><path d="M621.714286 497.371429c-5.22449 0-10.44898-2.089796-14.628572-6.269388L532.897959 417.436735c-8.359184-8.359184-8.359184-21.420408 0-29.779592 8.359184-8.359184 21.420408-8.359184 29.779592 0l73.665306 73.665306c8.359184 8.359184 8.359184 21.420408 0 29.779592-4.179592 4.179592-9.404082 6.269388-14.628571 6.269388z" fill="#bfbfbf" p-id="4306"></path>`
        postEditElement.innerHTML = editSvgCode;

        // create delete icon element
        const postDeleteElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        postDeleteElement.classList.add("icon");
        postDeleteElement.setAttribute('id', 'delete-icon');
        postDeleteElement.setAttribute('t', '1713902624534');
        postDeleteElement.setAttribute('viewBox','0 0 1030 1024');
        postDeleteElement.setAttribute('version', '1.1');
        postDeleteElement.setAttribute('p-id', '6029');
        postDeleteElement.setAttribute('width', '18px');
        // insert delete SVG code into SVG element
        const deleteSvgCode = `
        <path d="M1017.6 192c0-19.2-19.2-38.4-38.4-38.4h-288c-12.8-89.6-89.6-153.6-179.2-153.6-51.2 0-102.4 19.2-134.4 57.6-25.6 25.6-38.4 57.6-44.8 96h-294.4c-19.2 0-38.4 19.2-38.4 38.4s19.2 38.4 38.4 38.4h76.8v627.2c0 89.6 76.8 166.4 166.4 166.4h454.4c89.6 0 166.4-76.8 166.4-166.4v-627.2h83.2c19.2 0 38.4-19.2 32-38.4z m-582.4-76.8c19.2-19.2 51.2-32 76.8-32 44.8 0 83.2 32 96 70.4h-192c6.4-19.2 12.8-32 19.2-38.4z m390.4 742.4c0 51.2-38.4 89.6-89.6 89.6h-454.4c-51.2 0-89.6-38.4-89.6-89.6v-627.2h633.6v627.2z" fill="#666666" p-id="6030"></path><path d="M364.8 806.4c19.2 0 38.4-12.8 38.4-38.4v-320c0-19.2-19.2-38.4-38.4-38.4h-6.4c-19.2 0-38.4 19.2-38.4 38.4v320c0 19.2 19.2 38.4 44.8 38.4zM665.6 800c19.2 0 38.4-19.2 38.4-38.4v-320c0-19.2-19.2-38.4-38.4-38.4h-6.4c-19.2 0-38.4 19.2-38.4 38.4v320c0 19.2 19.2 38.4 44.8 38.4zM524.8 800c19.2 0 38.4-19.2 38.4-38.4v-320c0-19.2-19.2-38.4-38.4-38.4h-6.4c-19.2 0-38.4 19.2-38.4 38.4v320c0 19.2 19.2 38.4 44.8 38.4z" fill="#666666" p-id="6031"></path>
        `;
        postDeleteElement.innerHTML = deleteSvgCode;

        // create div element to include edit and delete icon
        const editSection = document.createElement('div');
        editSection.classList.add('edit-section');

        // create div element to include title and 2 icons
        const titleWithIcons = document.createElement('div');
        titleWithIcons.classList.add('titleWithIcons');

        editSection.appendChild(postEditElement);
        editSection.appendChild(postDeleteElement);
        titleWithIcons.appendChild(titleElement);
        titleWithIcons.appendChild(editSection);
        postDetailElement.appendChild(titleWithIcons);
        // when user click delete icon, execute deletePost() function
        postDeleteElement.addEventListener('click',async() => {
            const confirmed = confirm("Are you sure you want to delete this post?");
            if (confirmed) {
                await post.deletePost(postId, user.username);
                // back to homepage
                window.location.href=`home.html`;
            }
        })

//-------------------edit post-------------------
        let isEditMode = false; // 标志当前是否处于编辑模式
        let titleInputElement, contentTextAreaElement, saveButton; // 声明编辑元素变量

        // When user clicks edit icon, toggle edit mode and create input fields
        postEditElement.addEventListener('click', () => {
            isEditMode = !isEditMode; // 切换编辑模式状态

    if (isEditMode) {
        // 进入编辑模式
        // 创建输入框和保存按钮
        titleInputElement = document.createElement("input");
        titleInputElement.classList.add("edit-title");
        titleInputElement.value = postDetail.title;

        // 替换标题元素为输入框
        titleElement.replaceWith(titleInputElement);

        contentTextAreaElement = document.createElement("textarea");
        contentTextAreaElement.classList.add("edit-content");
        contentTextAreaElement.textContent = postDetail.content;

        // 替换内容元素为输入框
        contentElement.replaceWith(contentTextAreaElement);

        saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("btn", "btn-primary");
        // 当用户点击保存按钮时
        saveButton.addEventListener('click', async () => {
        try {
        const currentTimeStamp = new Date().toISOString();

        const response = await fetch(`http://localhost:3001/post/editPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: titleInputElement.value,
                content: contentTextAreaElement.value,
                postId: postId,
                image_name: post.image_name,
                username: user.username,
                timestamp: currentTimeStamp // 更新时间戳
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 直接使用返回的最新时间戳更新时间显示
            savedElement.textContent = formattedTime(currentTimeStamp);

            // 移除编辑模式并更新页面显示的帖子详情
            titleElement.textContent = titleInputElement.value;
            contentElement.textContent = contentTextAreaElement.value;
            titleInputElement.replaceWith(titleElement);
            contentTextAreaElement.replaceWith(contentElement);
            postDetailElement.removeChild(saveButton);
            postDetailElement.classList.remove('edit-mode');

            if (postDetail.image_name) {
                pictureElement.setAttribute("src", `server/public/images/${postDetail.image_name}`);
                pictureElement.setAttribute("alt", "Post Image");
                postDetailElement.appendChild(pictureElement);
            } else {
                pictureElement.setAttribute("alt", "No image available");
            }

            return postDetailElement;
        } else {
            console.error("更新帖子时出错:", data.error);
        }

    } catch (error) {
        console.error("更新帖子时出错:", error);
    }
});


        // 将保存按钮添加到页面中
        postDetailElement.appendChild(saveButton);

        // 如果在编辑模式下，聚焦到标题输入框
        titleInputElement.focus();
    } else {
        // 退出编辑模式
        // 移除标题和内容输入框以及保存按钮
        titleInputElement.replaceWith(titleElement);
        contentTextAreaElement.replaceWith(contentElement);
        postDetailElement.removeChild(saveButton);
    }
});



    } else {
        postDetailElement.appendChild(titleElement);
    }
    postDetailElement.appendChild(authorElement);
    postDetailElement.appendChild(savedElement);
    postDetailElement.appendChild(contentElement);

    // check if the post have a picture
    // if(post.picture){
    //     // if the picture exits, insert it into the page
    //     postDetailElement.appendChild(pictureElement);
    // } 
    if (postDetail.image_name) {
        pictureElement.setAttribute("src", `server/public/images/${postDetail.image_name}`);
        pictureElement.setAttribute("alt", "Post Image");
        postDetailElement.appendChild(pictureElement);
    } else {
        pictureElement.setAttribute("alt", "No image available");
    }
    
    return postDetailElement;
}

//------------------------ like button ------------------------
// 获取点赞按钮和点赞数显示的元素
function setupLikeButton(){
    // // Initialize the number of likes
    // let likeCount = 0;
    // let hasLiked = false;

    // add event listener when click 'like'
    likeButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:3001/post/likePost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    postId: postId,
                    username: user.username})
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                const { message, like_count } = responseData;
                alert(message);
                likeCountElement.textContent = like_count;
            } else {
                alert(responseData.error);
            }
        } catch (error) {
            console.error("Error liking post:", error);
            alert("An error occurred while liking the post.");
        }
    });

    //     try {
    //         const likeInfo = await post.likePost(postId, user.username);
    //         console.log(likeInfo.id);
    //         // Check if like was successful and get the id
    //         if (likeInfo && likeInfo.id) {
    //             // Update local storage with the new like status
    //             localStorage.setItem(postId, JSON.stringify({ hasLiked: true, likeCount: likeInfo.like_count }));
    //             hasLiked = true;
    //             likeCount = likeInfo.like_count;
    //             likeCountElement.textContent = likeCount.toString(); // Update like count after backend response
    //         } else {
    //             // Display a message indicating user has already liked the post
    //             alert("You have already liked this post");
    //         }
    //     } catch (error) {
    //         console.error("Error liking post:", error);
    //         // Handle error
    //     }
    // });
}


//------------------------ comment section ------------------------
// add new comment
const commentInput = document.getElementById("comment-input");
const commentButton = document.querySelector(".comment-section button");

commentButton.addEventListener("click", async function() {
    const newCommentText = commentInput.value.trim(); //get new comment from input
    if (newCommentText !== "") {
        try {
            // insert new comment to database
                await post.insertComment(postId, user.username, newCommentText);
                 // get comments frome database
                 const postDetail = await post.fetchPostDetails(postId);
                 postDetail.comments.sort((a, b) => new Date(a.time) - new Date(b.time));
                 const latestComment = postDetail.comments[postDetail.comments.length - 1]
                 const commentElement = createCommentElement(latestComment);
                 commentsContainer.appendChild(commentElement);

                // 将评论容器滚动到底部，确保最新评论可见
                commentsContainer.scrollTop = commentsContainer.scrollHeight;
              
                // 重新加载帖子详情以更新评论和帖子内
                // await loadPostDetails(postId);
                commentInput.value = ""; // 清空评论输入框
                // updateComments();
            } catch (error) {
                console.error("An error occurred while inserting comment:", error);
            }
        }
    });

// create element to display a comment
function createCommentElement(comment) {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");
    const { username, text, time, comment_id} = comment; // 解构评论对象的参数
    // display username and time of current comment
    const commentInfoElement = document.createElement("p");
    commentInfoElement.classList.add("comment-info");
    commentInfoElement.textContent = `Comment by ${username} at ${formattedTime(time)}`;
    // display text of current comment
    const commentTextElement = document.createElement("p");
    commentTextElement.textContent = text;
    // display delete icon of current comment if logged user is who create this comment
    if (username === user.username) {
        // create delete icon element
        const commentDeleteElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // console.log(commentDeleteElement)
        commentDeleteElement.classList.add("icon");
        commentDeleteElement.setAttribute('id', 'delete-icon');
        commentDeleteElement.setAttribute('t', '1713902624534');
        commentDeleteElement.setAttribute('viewBox','0 0 1030 1024');
        commentDeleteElement.setAttribute('version', '1.1');
        commentDeleteElement.setAttribute('p-id', '6029');
        commentDeleteElement.setAttribute('width', '18px');
        // insert SVG code into SVG element
        const svgCode = `
        <path d="M1017.6 192c0-19.2-19.2-38.4-38.4-38.4h-288c-12.8-89.6-89.6-153.6-179.2-153.6-51.2 0-102.4 19.2-134.4 57.6-25.6 25.6-38.4 57.6-44.8 96h-294.4c-19.2 0-38.4 19.2-38.4 38.4s19.2 38.4 38.4 38.4h76.8v627.2c0 89.6 76.8 166.4 166.4 166.4h454.4c89.6 0 166.4-76.8 166.4-166.4v-627.2h83.2c19.2 0 38.4-19.2 32-38.4z m-582.4-76.8c19.2-19.2 51.2-32 76.8-32 44.8 0 83.2 32 96 70.4h-192c6.4-19.2 12.8-32 19.2-38.4z m390.4 742.4c0 51.2-38.4 89.6-89.6 89.6h-454.4c-51.2 0-89.6-38.4-89.6-89.6v-627.2h633.6v627.2z" fill="#666666" p-id="6030"></path><path d="M364.8 806.4c19.2 0 38.4-12.8 38.4-38.4v-320c0-19.2-19.2-38.4-38.4-38.4h-6.4c-19.2 0-38.4 19.2-38.4 38.4v320c0 19.2 19.2 38.4 44.8 38.4zM665.6 800c19.2 0 38.4-19.2 38.4-38.4v-320c0-19.2-19.2-38.4-38.4-38.4h-6.4c-19.2 0-38.4 19.2-38.4 38.4v320c0 19.2 19.2 38.4 44.8 38.4zM524.8 800c19.2 0 38.4-19.2 38.4-38.4v-320c0-19.2-19.2-38.4-38.4-38.4h-6.4c-19.2 0-38.4 19.2-38.4 38.4v320c0 19.2 19.2 38.4 44.8 38.4z" fill="#666666" p-id="6031"></path>
        `;
        commentDeleteElement.innerHTML = svgCode;
        // create div element to include info and delete icon
        const infoWithDeleteIconElement = document.createElement('div')
        infoWithDeleteIconElement.classList.add('infoWithDeleteIcon');
        infoWithDeleteIconElement.appendChild(commentInfoElement);
        infoWithDeleteIconElement.appendChild(commentDeleteElement);
        commentElement.appendChild(infoWithDeleteIconElement);
        // when user click delete icon, execute deleteComment() function
        commentDeleteElement.addEventListener('click',async() => {
            const confirmed = confirm("Are you sure you want to delete this comment?");
            if (confirmed) {
                await post.deleteComment(comment_id, username);
                commentsContainer.innerHTML = "";
                await loadPostDetails(postId);
            }
        })
    } else {
        commentElement.appendChild(commentInfoElement);
    }
    
    commentElement.appendChild(commentTextElement);

    return commentElement;
};


// 在页面加载完成后，调用加载帖子详细内容的函数
window.addEventListener("DOMContentLoaded", () => {
    loadPostDetails(postId);
});

 // 格式化时间
function formattedTime(timeString) {
    const date = new Date(timeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}