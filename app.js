var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    app = express(),
    port = 3000;

//set basic env
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

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
//UPDATE route
//DESTROY route

app.listen(port, function () {
    console.log('server up and running on port', port)

})