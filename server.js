//EXPRESS FRAMEWORK SETUP
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

//MONGOOSE DATABASE SETUP (linked with remote mongodb using mongolab)
var mongoose = require('mongoose');
var CREDENTIALS = process.env.credentials;
mongoose.connect('mongodb://' + CREDENTIALS + '@ds053784.mongolab.com:53784/blizzard_api_db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//DATABASE SCHEMA SETUP
var AccountSchema = mongoose.Schema({
  account_name: String,
  account_id: Number,
  characters: {
      character:{
        character_id: Number,
        name: String,
        race: String,
        class: String,
        faction: String,
        level: Number,
      }
  }

});

var Account = mongoose.model('Account', AccountSchema);


var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json({ message: 'we\'re in!' });
});

router.get('/about', function(req, res) {
    res.status(200).json({ "author" : "Roland Zeng", "source" : "tba" });
});

//GET localhost:5000/account should list all accounts 
//POST localhost:5000/account with params 'name' and 'bob' should add bob as an account and return bob's new account ID 
router.route('/account')
  .get(function(req,res){
    Account.find(function(err, accounts) {
			if (err)
				res.status(500).send(err);
      else {
        res.status(200).json(accounts);
      }

		});
  })
  .post(function(req,res){
    var acc = new Account();
    var query = Account.find({'account_name': req.body.name}, function(err,match) {
      if (match.length === 0) {
        acc.account_name = req.body.name;
        acc.save(function(err) {
          if (err)
            res.status(500).send(err);
          else {
            res.status(200).json({ account_id: acc._id });
          }
        });
      }
      else {
        res.status(422).json({error: 'account name already exists!'})
      }

    });
  });

//GET localhost:5000/account/bob should return all of bob's characters
router.route('/account/:acc_name')
  .get(function(req,res){
    Account.find({'account_name': req.params.acc_name}, function(err,match){
      if (match.length === 0) {
        res.status(404).json({error: 'couldn\'t find account'})
      }
      else {
        res.status(200).json({message: 'found! - todo'})
      }

    });

  });

app.use('/', router);






app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port'));
});
