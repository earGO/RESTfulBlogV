var express, bodyParser, mongoose, methodOverride, app, port, expressSanitizer;

express = require('express');
bodyParser = require('body-parser');
mongoose = require("mongoose");
methodOverride = require("method-override");
expressSanitizer = require("express-sanitizer");
app = express();
port = 3000;

//set basic env
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//set up MongoDB
mongoose.connect('mongodb://localhost/restful_blog_app', { useNewUrlParser: true } );

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type: Date,default: Date.now()}
})

var Blog = mongoose.model('Blog',blogSchema)

// basic '/' route redirects to main index route
app.get('/',(req,res) => {
    res.redirect('/blogs')
})

//main INDEX route
app.get('/blogs',(req,res) => {
    Blog.find({},(err,posts) => {
        if(err){
            console.log('uups, got some minor error',err)
        } else {
            res.render('index',{posts:posts});
        }
    })
})

//NEW route
app.get('/blogs/new',(req,res) => {
    res.render('new');
})

//CREATE route
app.post('/blogs',(req,res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    let newPost = req.body.blog
    Blog.create(newPost,(err,post) => {
        if (err) {
            console.log('uups got an error',err);
        } else {
            res.redirect('/blogs')
        }
    })
})

//SHOW route
app.get('/blogs/:id',(req,res) => {
    Blog.findById(req.params.id,(err,foundPost) =>{
        if(err) {
            console.log('error finding post',err)
        } else {
            res.render('show',{post:foundPost})
        }
    })
})

//EDIT page route
app.get('/blogs/:id/edit',(req,res) => {
    Blog.findById(req.params.id,(err,foundPost) =>{
        if(err) {
            console.log('error finding post',err)
            res.redirect('/blogs')
        } else {
            res.render('edit',{post:foundPost})
        }
    })
})

//UPDATE route
app.put('/blogs/:id',(req,res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findOneAndUpdate(
        req.params.id,
        req.body.blog,
        (err,updatedPost) => {
            if (err) {
                console.log('error updating post',err)
                res.redirect('/blogs')
            } else {
                console.log('updated post, YAY!!!!')
                res.redirect('/blogs/'+req.params.id)
            }
        }
    )
})

//DESTROY route
app.delete('/blogs/:id',(req,res) => {
        //first destroy post
    Blog.findOneAndRemove(req.params.id,(err) => {
        if (err) {
            console.log('error deleting post \n',err)
            res.redirect('/blogs')
        } else {
            console.log('successfully deleted post')
            res.redirect('/blogs')
        }
    })
    //then redirrect somewhere
 })

app.listen(port, function () {
    console.log('server up and running on port', port)

})