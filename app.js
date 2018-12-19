var express = require('express');
var app = express();
var port = 3000;

app.get('/', (req, res) => {
    res.send('got server up and running')
})

app.listen(port, function () {
    console.log('server up and running on port', port)

})