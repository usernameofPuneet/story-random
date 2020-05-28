//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://puneet:test123@cluster0-tae4f.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
  if(!err){
    console.log("successfully connected to database");
    
  }
})

const homeStartingContent = "Welcome to our website. Here you can post any random story. It can be from your life or someone else's, it can be a true incident or just a product of your imagination, it can be something that prouds you or a confession, a funny incident or a heart break poem, you can post anything your name will be a secret so leave the tension of being in fame ot infamy. If you want to share what is in your mind just do it here. To publish your own story click on the 'COMPOSE' on the navbar. Stop thinking and start typing! All the best with your masterpiece."
const aboutContent = "This site is built by Puneet Sharma, currently pursuing B.Tech in Computer Science from MNNIT, Allahabad. He was too bored during lockdown so he made this website. Please don't show your personal hatred against him in posts of this website. He would soon be adding new features for stories like login, signup, comments, like and dislike etc.";
const contactContent = "If you want to contact me you can refer the following details";

const postSchema = new mongoose.Schema({
  writerName: {
    type: String,
    required: [true, "Please specify a name"]
  } ,
  email: {
    type: String,
    required: [true, "Please specify an email!"]
  } ,
  title : {
    type: String,
    required: [true, "Please specify a title."]
  } ,
  content :{
    type: String,
    required: [true, "Please write something in your post."]
  } 
});

const Post = mongoose.model("Post", postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


let posts =[];


app.get("/", function(req, res){

  Post.find({}, function(err, foundPosts){
    // console.log(foundPosts);
    posts = foundPosts;

    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });

  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };

  // posts.push(post);

  const post = new Post ({
    writerName: req.body.writerName,
    email: req.body.emailId,
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
