var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));


var credentials = 'rzeng:reverse';

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + credentials + '@ds053784.mongolab.com:53784/blizzard_api_db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'we\'re in!' });
});

app.use('/', router);






app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port'));
});
