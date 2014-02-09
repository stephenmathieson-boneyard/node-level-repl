#!/usr/bin/env node

var repl = require('./');
var program = require('commander');

program._name = 'level-repl';

program
  .version(require('./package.json').version)
  .option('-p, --path [path]', 'path to database', process.cwd())
  .option('-e, --engine <engine>', 'database backend');

program.on('--help', repl.help.bind(null, 'REPL'));

program.parse(process.argv);

if (!program.engine)
  throw new Error('database engine required');

repl(program.path, require(program.engine));
