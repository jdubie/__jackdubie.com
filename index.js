var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    debug = require('debug')('blog'),
    _ = require('underscore'),
    handlebars = require('handlebars'),
    marked = require('marked');

var ARTICLE_DIR = 'articles';

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  getMostRecent(5, function (err, recent) {
    if (err) throw err;
    var layout = fs.readFileSync(path.join(__dirname, 'layout.hbs'), 'ascii');
    layout = handlebars.compile(layout);
    res.end(layout({ posts: recent }));
  });
});

app.listen(3005);

function addTimestamps (postName, callback) {
  var filename = path.join(__dirname, ARTICLE_DIR, postName)
  fs.stat(filename, function (err, stats) {
    if (err) return callback(err);
    callback(null, { filename: filename, mtime: stats.mtime, ctime: stats.ctime });
  });
}

function addContents (post, callback) {
  debug('post', post);
  fs.readFile(post.filename, 'ascii', function (err, content) {
    debug('content', content);
    if (err) return callback(err);
    post.html = marked(content);
    callback(null, post);
  });
}

function getMostRecent (n, callback) {
  fs.readdir(path.join(__dirname, ARTICLE_DIR), function (err, contents) {
    if (err) return callback(err);
    async.map(contents, addTimestamps, function (err, posts) {
      if (err) return callback(err);
      posts = _(_(posts).sortBy(function (post) {
        return -post.ctime;
      })).first(n);
      async.map(posts, addContents, callback);
    });
  });
}
