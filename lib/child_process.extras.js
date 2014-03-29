var child_process = require('child_process'),
    Q = require('q');

function exec(command, options) {

  var deferred = Q.defer();
  var childProcess;

  var args = Array.prototype.slice.call(arguments, 0);
  args.push(function(err, stdout, stderr) {
    if (err) {
      err.message += command + ' (exited with error code ' + err.code + ')';
      err.stdout = stdout;
      err.stderr = stderr;
      deferred.reject(err);
    }
    else {
      deferred.resolve({
        childProcess: childProcess,
        stdout: stdout,
        stderr: stderr
      });
    }
  });

  childProcess = child_process.exec.apply(child_process, args);
  process.nextTick(function() {
    deferred.notify(childProcess);
  });

  return deferred.promise;
}

exports.exec = exec;
