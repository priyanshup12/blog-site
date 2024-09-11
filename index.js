import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
let blog_ids = 1;
app.use(express.static("public"));

// app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
  
const upload = multer({ storage: storage })

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/blogs", (req, res) => {
  res.render("blogs.ejs", {
    blogCards: blogsContent,
  });
});

app.get("/view", (req, res) => {
  let reqData = req.query.id;
  console.log(reqData);
  res.render("view-post.ejs", blogsContent[reqData - 1]);
});

app.get("/post", (req, res) => {
  res.render("post.ejs");
});

app.post("/submit",upload.single("imgSrc"), (req, res) => {
  console.log(req.body);
  const uploadData = {
    bid: blog_ids++,
    imgSrc: "/images/uploads/" + req.file.originalname,
    title: req.body.title,
    date: new Date().getDate(),
    content: req.body.content
  }
  blogsContent.push(uploadData);
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen(port, () => {
  console.log("Server listening at port", port);
});

let blogsContent = [
  {
    bid: blog_ids++,
    imgSrc: "images/urban-legends.jpg",
    title: "What are Urban Legends?",
    date: new Date().getDate(),
    content:
      "Urban legends weave captivating tales that blend fear and fascination, spreading through communities with chilling plausibility. These modern myths reflect collective anxieties, often revealing deeper truths about our cultural fears and values.",
  },
  {
    bid: blog_ids++,
    imgSrc: "images/nwow.png",
    title: "Natural Wonders of the World",
    date: new Date().getDate(),
    content:
      "Natural wonders of the world, like the Grand Canyon, Great Barrier Reef, and Mount Everest, showcase Earth's breathtaking beauty and diversity. These majestic sites, shaped by geological and ecological processes, captivate with their grandeur and inspire awe in visitors worldwide.",
  },
  {
    bid: blog_ids++,
    imgSrc: "images/wos.png",
    title: "Wonders of Science",
    date: new Date().getDate(),
    content:
      "The wonders of science illuminate the mysteries of our universe, transforming the impossible into reality. From unlocking DNA's secrets to exploring distant galaxies, science fuels innovation and deepens our understanding of existence.",
  },
  {
    bid: blog_ids++,
    imgSrc: "images/rich.jpeg",
    title: "Richest Person in the World",
    date: new Date().getDate(),
    content:
      "As of 2024, the title of the richest person in the world frequently changes due to fluctuations in stock prices and investments. Currently, Bernard Arnault, chairman and CEO of LVMH, is often at the top of the list, though figures like Elon Musk and Jeff Bezos also frequently contend for the position. For the most current information, checking a real-time wealth tracker from sources like Forbes or Bloomberg would provide the latest updates.",
  },
  {
    bid: blog_ids++,
    imgSrc: "images/BMW.jpg",
    title: "Black Myth Wukong! The next Game of the Year?",
    date: new Date().getDate(),
    content:
      "Black Myth: Wukong is generating buzz as a potential Game of the Year contender with its stunning visuals and innovative gameplay inspired by Chinese mythology. The game’s rich narrative and captivating mechanics set a high bar for 2024’s gaming landscape.",
  },
  {
    bid: blog_ids++,
    imgSrc: "images/outer-space.jpg",
    title: "Outer Space",
    date: new Date().getDate(),
    content:
      "Outer space, also known as the cosmos, is the vast expanse beyond Earth's atmosphere. It contains galaxies, stars, planets, and mysterious phenomena like black holes.In space, there's a region called the 'Great Nothing' where the density of matter is incredibly low—almost a vacuum within a vacuum! 🚀",
  },
];
