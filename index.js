const FeedParser = require('feedparser'),
request = require('request'),
readline = require('readline'),
Promise = require('bluebird'),
ProgressBar = require('progress');

//----------- readline configuration -----------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


//----------- fetch process -------------------
function fetch(){
  return new Promise((resolve, reject) => {
    const posts = [],
    req = request('http://gizmodo.uol.com.br/feed/'),
    feedparser = new FeedParser();

    req.on('error', done);
    req.on('response', res => {
      if (res.statusCode != 200) return req.emit('error', new Error('Bad status code'));
      req.pipe(feedparser);
    });

    feedparser.on('error', done);
    feedparser.on('readable', () => {
      let post;
      while(post = feedparser.read()) {
        let index = posts.push(post) - 1;
        console.log(index + ") " + post.title);
      }
    });
    feedparser.on('end', () => {
      resolve(posts);
    });
  });
}

function fetchPost(index){
  console.log(posts[index]);
}

function done(err) {
  if (err) {
    console.log(err, err.stack);
   return process.exit(1);
  }

  process.exit();
};

fetch().then(posts => {
  rl.question('What post do you want do read? ', answer => {
    console.log("Link: " + posts[answer].link);
    rl.close();
  });
});

