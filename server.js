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
  account_id: String,
  link: String
})

var CharacterSchema = mongoose.Schema({
  account_id: String,
  character_id: String,
  name: String,
  race: String,
  class: String,
  faction: String,
  level: Number

})

var Account = mongoose.model('Account', AccountSchema);
var Character = mongoose.model('Character', CharacterSchema);


var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).send('Hello! Source code & getting started: https://github.com/rzeng95/blizzardAPI');
});

router.get('/about', function(req, res) {
    res.status(200).json({ "author" : "Roland Zeng", "source" : "https://github.com/rzeng95/blizzardAPI" });
});

//GET localhost:5000/account should list all accounts
//POST localhost:5000/account with params 'name' and 'bob' should add bob as an account and return bob's new account ID
router.route('/account')
  .get(function(req,res){
    Account.find(function(err, accs) {
			if (err)
				res.status(500).send(err);
      else {
        res.status(200).json({accounts: accs});
      }

		});
  })
  .post(function(req,res){
    var acc = new Account();
    var query = Account.find({'account_name': req.body.name}, function(err,match) {
      if (match.length === 0) {
        acc.account_name = req.body.name;
        acc.account_id = (acc._id).toString()
        acc.link = 'http://blizzardAPI.herokuapp.com/account/' + req.body.name
        acc.save(function(err) {
          if (err)
            res.status(500).send(err);
          else {

            res.status(200).json({ account_id: acc.account_id });
          }
        });
      }
      else {
        res.status(422).json({error: 'account name already exists!'})
      }

    });
  });

//GET localhost:5000/account/bob isn't one of the requirements, but I added it in to link the user to the /characters page
//DELETE localhost:5000/account/bob deletes bob account
router.route('/account/:acc_name')
  .get(function(req,res){
    Account.find({'account_name': req.params.acc_name}, function(err,match){
      if (match.length === 0) {
        res.status(404).json({error: 'couldn\'t find account'})
      }
      else {
        var url = 'http://blizzardAPI.herokuapp.com/account/' + req.params.acc_name + '/characters'
        var msg = 'Found account! Go to ' + url +' to view full character list'
        res.status(200).json({message: msg})
      }

    })

  })

  .delete(function(req,res) {
    Account.remove({'account_name': req.params.acc_name}, function(err,result){
      if (err)
        res.send(err);
      else {
        res.status(200).json({message: 'account deleted!'})
      }
    })

  })

//GET localhost:5000/account/bob/characters should return all of bob's characters
//POST localhost:5000/account/bob/characters with the character specs should add a new character
router.route('/account/:acc_name/characters')
  .get(function(req,res){

    var query1 = Account.find({'account_name': req.params.acc_name}, function(err,match) {
      if (match.length === 0) {
        res.status(404).json({error: 'couldn\'t find account'})
      }
      else {
        queried_account_id = match[0].account_id
        var query2 = Character.find({'account_id' : queried_account_id}, function(err,match2){
          var charMap = {};

          var i = 0;
          while (match2[i] !== undefined) {
            charMap[match2[i].name] = match2[i]
            i++;
          }

          res.status(200).json({account_id: queried_account_id, characters: charMap})
        })
      }
    })
  })

  .post(function(req,res){

    var query1 = Account.find({'account_name': req.params.acc_name}, function(err,match) {
      if (match.length === 0) {
        res.status(404).json({error: 'couldn\'t find account'})
      }
      else {
        var character = new Character();
        character.character_id = (character._id).toString()
        var query2 = Character.find({'name': req.body.name}, function(err,match2) {
          if (match2.length === 0) {

            character.account_id = match[0].account_id;
            character.name = req.body.name;
            character.race = req.body.race;
            character.class = req.body.class;
            character.faction = req.body.faction;
            character.level = req.body.level;
            character.save(function(err) {
              if (err)
                res.status(500).send(err);
              else {
                res.status(200).json({ character_id: character._id });
              }
            });

          }
          else {
            res.status(422).json({error: 'character name already taken!'})
          }

        })
      }
    })
  })

//DELETE localhost:5000/account/bob/characters/JOE should delete JOE from list of characters
router.route('/account/:acc_name/characters/:character_name')
  .delete(function(req, res) {
      var query1 = Account.find({'account_name': req.params.acc_name}, function(err,match) {
      if (match.length === 0) {
        res.status(404).json({error: 'couldn\'t find account'})
      }
      else {
        var query2 = Character.find({'name': req.params.character_name}, function(err,match2){
          if(match2.length === 0) {
            res.status(404).json({error: 'couldn\'t find character to delete'})
          }
          else {
            Character.remove({'name' : req.params.character_name}, function(err, result) {
              if (err) res.send(err)
              else res.status(200).json({message: 'Successfully deleted account!'})
            })
          }

        })

      }
    })


})

app.use('/', router);

app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port'));
});
