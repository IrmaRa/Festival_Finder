var Festival = require('./client/src/models/festival.js')

var FestivalQuery = require('./db/festival_query.js');
var query = new FestivalQuery();

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function( req, res) {
  res.sendFile(__dirname + "/client/build/index.html")
})

app.get("/festivals", function(req,res){
  query.all(function(festivals) {
    res.json(festivals);
  })
})

app.get("/festivals/:id", function(req,res) {

  query.all(function(festivals) {
    res.json(festivals[req.params.id]);
  })
})

app.post("/festivals", function(req,res) {

  var newFestival = new Festival(
  {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    start: req.body.start,
    end: req.body.end,
    country: req.body.country,
    position: req.body.position
  })

  query.add(newFestival, function(festivals) {
    res.json(festivals);
  })
})
//hand routing to controllers
app.use(require("./client/controllers/index"));

//setup static files
app.use(express.static("client/build"));

//run node.js

app.listen(3000, function () {
  console.log( " listening on 3000" );
})
