var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var multer = require('multer');

//var project = require('./router');
var upload = multer({ dest: 'uploads/'})
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const $PORT = process.env.port || 8080;

//To use static assets directories
app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('images'));


//Template engine
app.engine('html', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err)
    // this is an extremely simple template engine
    var rendered = content.toString()
    .replace('#report#', options.report)
    .replace('#message#', options.message)
    //.replace('#script#', options.script)
    return callback(null, rendered)
  })
})

app.set('views', './views') // specify the views directory
app.set('view engine', 'html') // register the template engine

app.get('/', function(req,res){

    fs.readFile('index.html', 'utf8', function(err,content){
        res.send(content);
    })
})

app.get('/branchinitiative', function(req,res){

    fs.readFile('branchinitiative.html', 'utf8', function(err,content){
        res.send(content);
    })
})

app.post('/branchinitiative', function(req,res){
  logRequest('logs/branchinitiativelog.csv', stringifyLog(req.body), function(err){})
  res.redirect('/');
})

app.get('/z600', function(req,res){

    fs.readFile('z600.html', 'utf8', function(err,content){
        res.send(content);
    })
})

app.post('/z600', upload.single("details"), function(req,res){

  logRequest('logs/anticipatoryprojectcode.csv', stringifyLog(req.body), function(err){})
  res.redirect('/');
})

app.get('/run', function(req,res){

    fs.readFile('run.html', 'utf8', function(err,content){
        res.send(content);
    })
})
app.post('/run', upload.single("details"), function(req,res){

  logRequest('logs/runcode.csv', stringifyLog(req.body), function(err){})
  res.redirect('/');
})

app.get('/timechange', function(req,res){

    fs.readFile('timechange.html', 'utf8', function(err,content){
        res.send(content);
    })
})

app.post('/timechange', upload.single("details"), function(req,res){

  logRequest('logs/timechange.csv', stringifyLog(req.body), function(err){})
  res.redirect('/');
})

var logRequest = function(path, text, callback){
  try {
    fs.appendFile(path, text, function(err){
      if (err) {
        //console.log(err);
        var interval = setInterval(append,15000);
        function append() {
          //console.log('trying again');
          fs.open(path, 'a', function(err,fd){
            if(err){
            } else {
              fs.write(fd, text, null, 'utf8', function(){
                fs.close(fd, function(){
                  console.log('success');
                  clearInterval(interval);
                });
              })
            }
          })
        }
      }
    })
  } catch (err) {
    callback(err);
  }
}

var stringifyLog = function(json){
  var d = new Date();
  var line = d.toString() + ',';
  for (var key in json){
    line += json[key] + ',';
  }
  line += "\n";
  return line;
}

app.listen($PORT, function(){
    console.log('Server listening on port ' + $PORT);
})
