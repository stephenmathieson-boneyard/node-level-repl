
var spawn = require('child_process').spawn;
var rm = require('rimraf');
var exists = require('fs').existsSync;
var assert = require('assert');

describe('level-repl', function () {
  beforeEach(function (done) {
    rm('./testdb', done);
  });

  it('should work with LevelDOWN', function (done) {
    var repl = spawn('./bin.js', [ '-p', 'testdb', '-e', 'leveldown' ]);
    repl.stderr.on('data', function () {
      throw new Error('REPL errored');
    });
    repl.stdout.on('data', function () {
      assert(exists('./testdb'));
      repl.kill();
      repl.on('close', function () {
        done();
      });
    });
  });

  it('should work with Sophist', function (done) {
    var repl = spawn('./bin.js', [ '-p', 'testdb', '-e', 'sophist' ]);
    repl.stderr.on('data', function () {
      throw new Error('REPL errored');
    });
    repl.stdout.on('data', function () {
      assert(exists('./testdb'));
      repl.kill();
      repl.on('close', function () {
        done();
      });
    });
  });

  it('should not lock the database', function (done) {
    var times = 10;
    (function again() {
      if (!--times) return done();
      var repl = spawn('./bin.js', [ '-p', 'testdb', '-e', 'leveldown' ]);
      repl.stdout.on('data', function () {
        repl.kill();
        repl.on('close', again);
      });
    }());
  });
});
