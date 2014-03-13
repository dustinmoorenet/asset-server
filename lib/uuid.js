var uuid = require('node-uuid');

uuid.validate = function(id) {
  var matches = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

  return !!(matches && matches.length == 1);
};
  
uuid.clean = function(id) {
  return uuid.unparse(uuid.parse(id));
};

module.exports = uuid;
