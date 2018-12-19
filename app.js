var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    app = express(),
    port = 3000;

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/restful_blog_app', { useNewUrlParser: true } );

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type: Date,default: Date.now()}
})

var Blog = mongoose.model('Blog',blogSchema)

app.get('/',(req,res) => {
    res.redirect('/blogs')
})

app.get('/blogs',(req,res) => {
    Blog.find({},(err,posts) => {
        if(err){
            console.log('uups, got some minor error',err)
        } else {
            res.render('index',{posts:posts});
        }
    })
})

app.get('/', (req, res) => {
    res.send('got server up and running')
})

app.get('/blogs/new',(req,res) => {
    res.render('new');
})

app.listen(port, function () {
    console.log('server up and running on port', port)

})