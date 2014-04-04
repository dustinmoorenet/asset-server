var Q = require('q');

var foo = function() {
  return Q.reject(new Error('my error'));

  return deferred.promise;
}


foo().then(function() {
  throw new Error('we shouldnt be here');
}, function(err) {
  console.log(err)
});
