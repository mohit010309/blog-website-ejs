const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://mohitakhouri83:mohit090301@cluster0.h4zap3z.mongodb.net/blogDB?retryWrites=true&w=majority");

const postSchema = new mongoose.Schema({
  postTitle:String,
  postContent:String
});

const postModel = mongoose.model("post",postSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//global variable for storing the posts created
const posts = [];

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// home route
app.get("/",function(req,res){
  res.render("home",{
    homeStartingContent:homeStartingContent,
    posts:posts
  });

  //just printing posts array for testing
  // console.log(posts);
});

// contact route
app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

// about route
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

// compose get route
app.get("/compose",function(req,res){
  res.render("compose");
});

// compose post route
app.post("/compose",function(req,res){
  const post = {
    postTitle:req.body.PostTitle,
    postContent:req.body.PostContent
  };
  posts.push(post);


  // saving data to database
  const newPost = new postModel({
    postTitle:req.body.PostTitle,
    postContent:req.body.PostContent
  });
  newPost.save();

  //redirecting to home route
  res.redirect("/");
});

// /posts/<some_route_name> route using routing parameters of express
app.get("/posts/:postName",function(req,res){
  
  // writing code to check if postName exists in the posts array
  // Using lodash module lowerCase to convert string to lowerCase
  // lowerCase ignores space, special characters
  let ans=false;
  const sr=_.lowerCase(req.params.postName);
  let ind=-1;
  for(let i=0;i<posts.length;i++)
  {
    const postTitle = _.lowerCase(posts[i].postTitle);
    if(postTitle===sr)
    {
      ind=i;
      ans=true;
      break;
    }
  }
  if(ans)
  {
    //console.log(posts[ind].postContent);
    res.render("post",{
      postTitle: posts[ind].postTitle,
      postContent: posts[ind].postContent
    });
  }
  else
  {
    res.render("failure");
  }

});