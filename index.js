const FeedParser = require('feedparser'),
request = require('request');

let req = request('http://gizmodo.uol.com.br/feed/'),
feedparser = new FeedParser();

const posts = [];

req.on('error', done);
req.on('response', res => {
  if (res.statusCode != 200) return req.emit('error', new Error('Bad status code'));
  req.pipe(feedparser);
});

feedparser.on('error', done);
feedparser.on('end', done);
feedparser.on('readable', () => {
  let post;
  while(post = feedparser.read()) {
    let index = posts.push(post) - 1;
    console.log(index + ") " + post.title);
  }
});


function done(err) {
  if (err) {
    console.log(err, err.stack);
   return process.exit(1);
  }

  process.exit();
};
