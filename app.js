var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
//App config 
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// Mongoose schema config
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title:"Test blog",
//     image:'https://www.campsitephotos.com/photo/camp/23143/feature_Black_Rock_State_Park-f1.jpg',
//     body:'Cool place'
// });
//Restful Routes config

// index routes
app.get("/blogs",(req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err)
        {
            console.log("Error");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
    
});
// new route
app.get("/blogs/new",(req,res) => {
    res.render("new");
});


//create route 
app.post("/blogs",(req,res) => {
    //create blog
    //redirect
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err,newBlog) => {
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }

    }); 
});
// show route

app.get("/blogs/:id",(req,res) => {
    Blog.findById(req.params.id, (err,foundBlog) => {
        if(err)
        {
            res.redirect("/blogs");
        }else{
            res.render("show", {blog:foundBlog});
        }

    });
});

//Edit route
app.get("/blogs/:id/edit",(req,res) => {
    Blog.findById(req.params.id, (err,foundBlog) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
    
}); 


//Update route 

app.put("/blogs/:id", (req,res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => { 
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }

    });
});

//Delete route

app.delete("/blogs/:id", (req,res) => {
    //destroy blog 
    //redirect /blogs
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });

});


app.listen("3000",() => {
    console.log("server is running");
});