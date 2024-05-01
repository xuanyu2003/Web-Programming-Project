import { BACKEND_URL } from '../config.js'

// Define the Comment class
class Comment{
  constructor(postId, username, text){
    this.postId = postId;
    this.username = username;
    this.text = text;
  }
}

class Post {
  #id
  #title
  #content
  #image_name
  #time
  #author
  #comments
  #like_count

  constructor(id,title,content,image_name,time,author,comments,like_count) {
    this.#id = id
    this.#title = title
    this.#content = content
    this.#image_name = image_name
    this.#time = time
    this.#author = author
    this.#comments = comments
    this.#like_count = like_count
  }

  get id() {
    return this.#id
  }

  get title() {
    return this.#title
  }

  get content() {
    return this.#content
  }

  get image_name() {
    return this.#image_name
  }

  get time() {
    return this.#time
  }

  get formattedtime() {
    const date = new Date(this.#time);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  get author() {
    return this.#author
  }

  get comments() {
    return this.#comments
  }

  get like_count() {
    return this.#like_count
  }


  // get post details
  async fetchPostDetails(id) {
    try {
      const response = await fetch(`${BACKEND_URL}/post/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
      const postData = await response.json();
      // 解构获取的数据并返回
      const { id: postID, title, content, image_name, time, username, comments, like_count } = postData;

      // 解析 comments 数组中的每个对象，提取所需的属性
      const parsedComments = [];
      for (const comment of comments) {
        const { text, username, time, comment_id} = comment;
        parsedComments.push({ text, username, time, comment_id });
      }
      return { id: postID, title, content, image_name, time, username, comments: parsedComments, like_count };
    } catch (error) {
      throw error; // 如果发生错误，则抛出错误
    }
  }
  
  // delete post
  async deletePost(postId, username){
    try {
      const response = await fetch(`${BACKEND_URL}/post/deletePost/${postId}?username=${username}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    return 'Post deleted successfully';
      } catch (error) {
    throw error;
    }
  }


  // Insert new comment to the database
  async insertComment(postId, username, text) {
    try {
      const comment = new Comment(postId, username, text);
      // for test
      // console.log(comment);
      const data = JSON.stringify(comment);
      const response = await fetch(`${BACKEND_URL}/post/insertComment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      });
      if (!response.ok) {
        throw new Error('Failed to insert comment');
      }
      const json = await response.json();
      return json.id;
    } catch (error) {
      throw error;
    }
  }

  // delete comment
  async deleteComment(comment_id, username){
    try {
      console.log(comment_id);
      console.log(username);
      const response = await fetch(`${BACKEND_URL}/post/deleteComment/${comment_id}?username=${username}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      return 'Comment deleted successfully';
        } catch (error) {
      throw error;
    }
  }
}

export { Post }