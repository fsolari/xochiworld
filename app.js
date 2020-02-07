const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const viewsPath = "/views";

app.use(express.static(path.join(__dirname, 'public')));

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * 
 *
 * router.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname + viewsPath + '/about.html'));
});

router.get('/projects', function (req, res) {
  res.sendFile(path.join(__dirname + viewsPath + '/projects.html'));
});

router.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname + viewsPath + '/contact.html'));
});

router.get('/press', function (req, res) {
  res.sendFile(path.join(__dirname + viewsPath + '/press.html'));
}); 
 */



app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');