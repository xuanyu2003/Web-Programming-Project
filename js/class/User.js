import { BACKEND_URL } from "../config.js";

class User {
  #id = undefined;
  #username = undefined;
  #email = undefined;
  #password = undefined;
  #newPassword = undefined;

  constructor() {
    const userFromStorage = sessionStorage.getItem("user");
    if (userFromStorage) {
      const userObject = JSON.parse(userFromStorage);
      this.#id = userObject.id;
      this.#username = userObject.username;
      this.#email = userObject.email;
      console.log("Loaded user id: ", this.#id); // 调试信息
  } else {
      console.log("No user in sessionStorage"); // 调试信息
  }
  }

  get id() {
    return this.#id;
  }

  get username() {
    return this.#username;
  }

  get email() {
    return this.#email;
  }

  get password() {
    return this.#password;
  }

  get newPassword() {
    return this.#newPassword;
  }

  //判断是否log
  get isLoggedIn() {
    return this.#username !== undefined ? true : false;
  }

  logout() {
    this.#username = undefined;
    sessionStorage.removeItem("user");
  }

  async login(username, password) {
    const data = JSON.stringify({ username: username, password: password });
    const response = await fetch(BACKEND_URL + "/user/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    if (response.ok === true) {
      const json = await response.json();
      this.#id = json.id;
      this.#username = json.username;
      this.#email = json.email;
      sessionStorage.setItem("user", JSON.stringify(json));
      return { username: json.username, id: json.id };
    } else {
      throw response.statusText;
    }
  }

  async signup(username, email, password) {
    const data = JSON.stringify({
      username: username,
      email: email,
      password: password,
    });
    const response = await fetch(BACKEND_URL + "/user/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    if (response.ok === true) {
      const json = await response.json();
      return json.id;
    } else {
      throw response.statusText;
    }
  }

  async checkEmailExists(email) {
    const data = JSON.stringify({ email: email });
    try {
      const response = await fetch(BACKEND_URL + "/user/check-email", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      if (response.ok === true) {
        const json = await response.json();
        return json.exists;
      } else {
        return false;
      }
    } catch (error) {
      console.error("An error occurred while checking email existence:", error);
      throw error;
    }
  }

  // async checkEmailExists(email) {
  //   const data = JSON.stringify({ email: email });
  //   try {
  //     const response = await fetch(BACKEND_URL + "/user/check-email", {
  //       method: "post",
  //       headers: { "Content-Type": "application/json" },
  //       body: data,
  //     });

  //     if (response.status === 200) {
  //       // Email exists
  //       const json = await response.json();
  //       return json.exists;
  //     } else if (response.status === 404) {
  //       // Email does not exist
  //       return false;
  //     } else {
  //       throw new Error("Unexpected status code: " + response.status);
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while checking email existence:", error);
  //     throw error;
  //   }
  // }

  async checkUsernameExists(username) {
    const data = JSON.stringify({ username: username });
    try {
      const response = await fetch(BACKEND_URL + "/user/check-username", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      if (response.ok === true) {
        const json = await response.json();
        return json.exists;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(
        "An error occurred while checking username existence:",
        error
      );
      throw error;
    }
  }

  async reset(email, newPassword) {
    const data = JSON.stringify({ email: email, newPassword: newPassword });
    try {
      const response = await fetch(BACKEND_URL + "/user/reset-password", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      if (response.ok === true) {
        const json = await response.json();
        return json.newPassword;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during password reset:", error);
      throw error;
    }
  }

  async newPost(formData) {
    try {
        const response = await fetch(BACKEND_URL + '/post/create', {
            method: 'post',
            body: formData
        });

        const json = await response.json(); // 假设即使在错误情况下也返回JSON
        if (response.ok) {
            return json;
        } else {
            throw new Error(json.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;  // 可以选择重新抛出错误，让调用者处理
    }
}

  async getPostsByUsername(username) {
    const data = JSON.stringify({ username: username });
    try {
      const response = await fetch(BACKEND_URL + "/post/myPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch posts for user ${username}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `An error occurred during getting posts from ${username} :`,
        error
      );
      throw error;
    }
  }

  // async deletePost(title) {
  //   const data = JSON.stringify({ title: title });
  //   try {
  //     const response = await fetch(BACKEND_URL + "/post/delete/" + postId, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       const json = await response.json();
  //       // 根据需要处理json
  //       return json; // 可能包含确认信息或其他数据
  //     } else {
  //       throw new Error(response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("An error occurred during post deletion:", error);
  //     throw error;
  //   }
  // }
}
export { User };
