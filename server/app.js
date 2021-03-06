var express = require('express');
var routes = require('./routes');
var map = require('./routes/map');
var about = require('./routes/about');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client/dist')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/api/map', map.main);
app.get('/api/about', about.main);
app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});