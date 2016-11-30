#! /usr/bin/env node
const FeedParser = require('feedparser'),
request = require('request'),
readline = require('readline'),
Promise = require('bluebird'),
cheerio = require('cheerio');


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

    req.on('error', reject);
    req.on('response', res => {
      if (res.statusCode != 200) reject(new Error('Bad status code'));
      req.pipe(feedparser);
    });

    feedparser.on('error', reject);
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

function fetchPost(link){
  return new Promise((resolve, reject) => {
    const req = request(link);
    req.on('error', reject);
    req.on('response', res => {
      if(res.statusCode != 200) reject(new Error('Bad status code'));
      let rawData = '';
      res.on('data', chunk =>  rawData += chunk);
      res.on('end', () => resolve(rawData));
    });
  });
}

function getContent(html) {
  const $ = cheerio.load(html);
  console.log($("#maincontent p").text());
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
    fetchPost(posts[answer].link).then(getContent).catch(done);
    rl.close();
  });
}).catch(done);

