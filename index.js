import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
let blog_ids = 1;
app.use(express.static("public"));

// app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/blogs", (req, res) => {
  fs.readFile("./content.json", "utf-8", (err, jsonContent) => {
    if (err) {
      console.error("Error while reading data:", err);
      return;
    }
    try {
      const blogsContent = JSON.parse(jsonContent);
      res.render("blogs.ejs", {
        blogCards: blogsContent
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });
});


app.get("/view", (req, res) => {
  let reqData = req.query.id;
  console.log(reqData);
  let blogsContent;
  fs.readFile("./content.json", "utf-8", (err, jsonContent) => {
    if (err) {
      console.error("Error while reading data:", err);
      return;
    }
    try {
      blogsContent = JSON.parse(jsonContent);
      res.render("view-post.ejs", blogsContent[reqData - 1]);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });
});

app.get("/post", (req, res) => {
  res.render("post.ejs");
});

app.post("/submit", upload.single("imgSrc"), (req, res) => {

  fs.readFile("./content.json", "utf-8", (err, jsonString) => {
    if (err) {
      console.error("Error while reading data:", err);
      return;
    }

    try {
      const blogsContent = JSON.parse(jsonString);
      let blog_ids = blogsContent[blogsContent.length - 1].bid;
      const uploadData = {
        bid: blog_ids+1,
        imgSrc: "/images/uploads/" + req.file.originalname,
        title: req.body.title,
        date: new Date(),
        content: req.body.content,
      };
      blogsContent.push(uploadData);
      const updatedContent = JSON.stringify(blogsContent, null, 2);
      fs.writeFile("./content.json", updatedContent, (writeErr) => {
        if (writeErr) {
          console.error("Error while writing data:", writeErr);
        } else {
          console.log("Blog data successfully updated.");
        }
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });

  res.redirect("/blogs");
});


app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen(port, () => {
  console.log("Server listening at port", port);
});
