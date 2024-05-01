const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
// const multer = require('multer');
const { userRouter } = require("./routes/user.js");
const { postRouter } = require("./routes/post.js");

const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
// app.use(multer);
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
