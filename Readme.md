
# level-repl

  REPL for LevelUP compatible databases.

## Installation

    $ npm install level-repl -g

## Usage

```
  Usage: level-repl [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --path [path]      path to database
    -e, --engine <engine>  database backend


  REPL Commands:

    put {key} = {value}    set key to value
    get {key}              get the value of key
    del {key}              delete key
    list                   list all key/value pairs
    keys                   list all keys
    clear                  clear all keys
```

## Example

```
$ level-repl -p testdb -e leveldown
db> put foo = bar
db> put foo bar = foobar
db> put "foo bar baz" = foobarbaz
db> get foo bar
'foobar'
db> list
[ { key: 'foo', value: 'bar' },
  { key: 'foo bar', value: 'foobar' },
  { key: 'foo bar baz', value: 'foobarbaz' } ]
db> delete foo bar baz
db> keys
[ 'foo', 'foo bar' ]
db> 
```

## License 

(The MIT License)

Copyright (c) 2014 Stephen Mathieson &lt;me@stephenmathieson.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.