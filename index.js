import express from "express";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views")); 
let blog_ids = 1;
app.use(express.static(path.join(__dirname, "/public")));

// app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    const filename = name.replaceAll(" ", "_");
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
const contentLoc = path.join(__dirname, "./content.json"); 

//Home Page
app.get("/", (req, res) => {
  res.render("index");
});

//Blog-Menu
app.get("/blogs", (req, res) => {
  fs.readFile(contentLoc, "utf-8", (err, jsonContent) => {
    if (err) {
      console.error("Error while reading data:", err);
      return;
    }
    try {
      const blogsContent = JSON.parse(jsonContent);
      res.render("blogs", {
        blogCards: blogsContent,
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });
});

//reading particular blog
app.get("/view", (req, res) => {
  let reqData = req.query.id;
  console.log(reqData);
  let blogsContent;
  fs.readFile(contentLoc, "utf-8", (err, jsonContent) => {
    if (err) {
      console.error("Error while reading data:", err);
      return;
    }
    try {
      blogsContent = JSON.parse(jsonContent);
      res.render("view-post", blogsContent[reqData - 1]);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });
});

//posting blog form
app.get("/post", (req, res) => {
  res.render("post");
});

//posting blog
app.post("/submit", upload.single("imgSrc"), (req, res) => {
  fs.readFile(contentLoc, "utf-8", (err, jsonString) => {
    if (err) {
      console.error("Error while reading data:", err);
      return;
    }

    try {
      const blogsContent = JSON.parse(jsonString);
      let blog_ids = blogsContent[blogsContent.length - 1].bid;
      const name = req.file.originalname;
      const filename = name.replaceAll(" ", "_");
      const uploadData = {
        bid: Number(blog_ids) + 1,
        imgSrc: "/images/uploads/" + filename,
        title: req.body.title,
        date: new Date().toLocaleDateString(),
        content: req.body.content,
      };
      blogsContent.push(uploadData);
      const updatedContent = JSON.stringify(blogsContent, null, 2);
      fs.writeFile(contentLoc, updatedContent, (writeErr) => {
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

//edit and update a blog
app.get("/edit", (req, res) => {
  const id = req.query.id;
  console.log("Edit blog ID: ", id);
  let blogsContent;
  fs.readFile(contentLoc, "utf-8", (err, jsonContent) => {
    if (err) {
      console.log(err, " Error in retrireving data");
    }
    try {
      blogsContent = JSON.parse(jsonContent);
      console.log(blogsContent[id - 1]);
      res.render("edit-post", blogsContent[id - 1]);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });
});
//update the data in json file
app.post("/update", upload.single("imgSrc"), (req, res) => {
  let id = req.query.id;
  fs.readFile(contentLoc, "utf-8", (err, jsonString) => {
    if (err) {
      console.error("Error while reading data:", err);
      return;
    }

    try {
      const blogsContent = JSON.parse(jsonString);
      const uploadData = blogsContent[id - 1];

      if (req.file) {
        const filename = req.file.filename; // This is the new filename after upload
        const oldImagePath = path.join(
          __dirname,
          "public",
          blogsContent[id - 1].imgSrc
        );

        // Update the image path in the JSON
        uploadData.imgSrc = "/images/uploads/" + filename;

        // Delete the old image if it exists
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Handle other updates (e.g., title, content)
      if (req.body.title) {
        uploadData.title = req.body.title;
      }
      if (req.body.content) {
        uploadData.content = req.body.content;
      }
      uploadData.date = new Date().toLocaleDateString();

      blogsContent[id - 1] = uploadData;
      const updatedContent = JSON.stringify(blogsContent, null, 2);

      fs.writeFile(contentLoc, updatedContent, (writeErr) => {
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

//deleting a blog.

app.get("/delete", (req, res) => {
  const id = req.query.id;
  let blogsContent;
  fs.readFile(contentLoc, "utf-8", (err, jsonContent) => {
    if (err) {
      console.log(err);
      return;
    }
    try {
      blogsContent = JSON.parse(jsonContent);
      const blog = blogsContent[id - 1];
      blogsContent.splice(id - 1, 1);
      for (let i = 6; i < blogsContent.length; i++) {
        blogsContent[i].bid = i + 1;
      }
      fs.unlink(path.join(__dirname, "public", blog.imgSrc), (err) => {
        console.log("related files are deleted");
      });
      fs.writeFile(
        contentLoc,
        JSON.stringify(blogsContent, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error("Error while writing data:", writeErr);
          } else {
            console.log("Blog data successfully updated.");
          }
        }
      );
      alert();
    } catch (parseError) {
      console.log(err);
      return;
    }
  });
  res.redirect("/blogs");
});

//about page
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log("Server listening at port", port);
});
