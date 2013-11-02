var path = require('path');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.sendfile(path.resolve('../') + '/client/dist/index.html');
};