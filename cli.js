#!/usr/bin/env node
var args = require('minimist')(process.argv.slice(2))
var figshare = require('./')()
var through = require('through2')

if (args._[0] === 'download') {
  var id = args._[1]
  var dir = args._[2] || process.cwd()
  dir = dir.toString()
  return figshare.get(id, function (err, article) {
    if (err) throw err
    figshare.download(article, dir, args, function (err) {
      if (err) throw err
      console.error('Download complete.')
    })
  })
}

if (args._[0] === 'search') {
  var text = args._[1]
  return figshare.search({fulltext: text}).pipe(through.obj(function (data, enc, next) {
    output = ''
    for (var i in data.items) {
      var result = data.items[i]
      output += result.article_id + ' ' + result.title.replace('<p>', '').replace('</p>', '') + ' \n'
    }
    next(null, output)
  })).pipe(process.stdout)
}

if (args._[0] === 'list') {
  var text = args._[1]
  return figshare.list({}).pipe(through.obj(function (data, enc, next) {
    output = ''
    for (var i in data.items) {
      var result = data.items[i]
      output += result.article_id + ' ' + result.title.replace('<p>', '').replace('</p>', '') + ' \n'
    }
    next(null, output)
  })).pipe(process.stdout)
}

console.log('figshare {list,search,download}')
