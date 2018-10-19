
const config = require('./congif');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public', {
    index: 'index.html'
}));

app.listen(config.port, function () {
    console.log('Server started on', config.port);
});