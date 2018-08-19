const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

//Redis Client
var client = redis.createClient();

// Connect to the Redis Client
client.on('connect', function(){
  console.log('Connected to Redis DB');
});

//Set ports for the app
var port = 3000;

// Init app
var app = express();

// View Engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//body-bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//methodOverride
app.use(methodOverride('_method'));

// Search Page
app.get('/', function(req, res, next){
    res.render('searchservers');
})

// Search proccesing requests
 app.post('/server/search', function(req, res, next){
  var id = req.body.id
  client.hgetall(id, function(err, obj){
      if(!obj){
        res.render('searchservers', {
          error: 'Server does not exist'
        });
      } else {
         obj.name = id;
         res.render('details', {
           server: obj

         });
         console.log(id);
      }
  });
});

app.listen(port, function(){
    console.log('Server started on port '+port);
});
