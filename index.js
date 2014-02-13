
var repl = require('repl');
var levelup = require('levelup');

exports = module.exports = lrepl;

/**
 * Output available commands.
 *
 * @api private
 * @param {String} prefix
 */

exports.help = function (prefix) {
  console.log('');
  if (prefix) {
    console.log('  %s Commands:', prefix);
  } else {
    console.log('  Commands:');
  }
  console.log('');
  console.log('    put {key} = {value}    set key to value');
  console.log('    get {key}              get the value of key');
  console.log('    del {key}              delete key');
  console.log('    list                   list all key/value pairs');
  console.log('    keys                   list all keys');
  console.log('    clear                  clear all keys');
  console.log('    export {path}          export all data to the db at path');
  console.log('    import {path}          import data from the db at path');
  console.log('');
};

/**
 * Start a REPL for the database at `path`,
 * using backend `engine`.
 *
 * @api public
 * @param {String} path
 * @param {Function} engine
 */

function lrepl(path, engine) {
  var db = levelup(path, { db: engine });

  db.open(function (err) {
    if (err) throw err;

    repl.start({
      prompt: 'db> ',
      eval: eval,
      ignoreUndefined: true
    })
    .on('exit', function () {
      db.close(function (err) {
        if (err) throw err;
      });
    });

    /**
     * Parse and evaluate `str`.
     */

    function eval(str, context, file, cb) {
      str = str.slice(1).slice(0, -2);
      var args = str.split(' ').filter(Boolean);
      var cmd = args.shift();
      args = args.join(' ');

      switch (cmd) {
        case 'help':
          exports.help();
          cb(null);
          break;

        case 'put':
        case 'set':
          return set(args, cb);

        case 'get':
          return get(args, cb);

        case 'del':
        case 'delete':
          return del(args, cb);

        case 'keys':
          return keys(args, cb);

        case 'list':
        case 'ls':
          return list(args, cb);

        case 'clear':
          return clear(args, cb);

        case 'export':
          return _export(args, cb);

        case 'import':
          return _import(args, cb);

        default:
          return cb('unsupported command: "' + cmd + '"');
      }
    }

    /**
     * Parse `args`, setting `key` = `value` in
     * the database.
     */

    function set(args, cb) {
      var parts = args.split('=');
      var key = normalize(parts.shift());
      var value = normalize(parts.shift());
      if (!key || !value) return cb('Missing param');
      db.put(key, value, cb);
    }

    /**
     * Get the value of `key` in the database.
     */

    function get(key, cb) {
      key = normalize(key);
      if (!key) return cb('Missing key');
      db.get(key, cb);
    }

    /**
     * Delete `key` from the database.
     */

    function del(key, cb) {
      key = normalize(key);
      if (!key) return cb('Missing key');
      db.del(key, cb);
    }

    /**
     * List all keys in the database.
     */

    function keys(args, cb) {
      stream({ keys: true, values: false }, cb);
    }

    /**
     * List all key/value pairs in the database.
     */

    function list(args, cb) {
      stream({ keys: true, values: true }, cb);
    }

    /**
     * Clear the database of all keys.
     */

    function clear(args, cb) {
      stream({ keys: true, values: false}, function (err, keys) {
        if (err) return cb(err);
        (function next(index) {
          var key = keys[index];
          if (!key) return cb(null);
          db.del(key, function (err) {
            if (err) return cb(err);
            next(++index);
          });
        }(0));
      });
    }

    /**
     * Export the db to the db at `path`.
     */

    function _export(path, cb) {
      path = normalize(path);
      var db2 = levelup(path, { db: engine });
      db2.open(function (err) {
        if (err) return cb(err);
        copy(db, db2, cb);
      });
    }

    /**
     * Import the db at `path` to the current db.
     */

    function _import(path, cb) {
      path = normalize(path);
      var db2 = levelup(path, { db: engine });
      db2.open(function (err) {
        if (err) return cb(err);
        copy(db2, db, cb);
      });
    }

    /**
     * Copy `src` db into `dest` db.
     */

    function copy(src, dest, cb) {
      var done = false;
      var read = src.createReadStream({ keys: true, values: true });
      var write = dest.createWriteStream();

      write
        .on('error', callback)
        .on('close', callback);

      read
        .on('error', callback)
        .pipe(write);

      function callback(err) {
        if (done) return;
        done = true;
        read.destroy();
        write.destroy();
        cb(err);
      }
    }

    /**
     * Create a Readable stream with `options`,
     * invoking `cb(err, [results])`.
     *
     * @api private
     * @param {Object} options
     * @param {Function} cb
     */

    function stream(options, cb) {
      var arr = [];
      db.createReadStream(options)
      .on('data', function (data) {
        arr.push(data);
      })
      .on('error', cb)
      .on('close', function () {
        cb(null, arr);
      });
    }

    /**
     * Drop extra whitespace and remove wrapping quotes.
     *
     * @api private
     * @param {String} str
     * @return {String}
     */

    function normalize(str) {
      str = (str || '').trim();
      if ('"' == str[0] || '\'' == str[0])
        str = str.slice(1);
      if ('"' == str[str.length - 1] || '\'' == str[str.length - 1])
        str = str.slice(0, -1);
      return str;
    }
  });
}
