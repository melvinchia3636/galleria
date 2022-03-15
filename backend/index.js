const express = require("express");
const fs = require("fs");
const path = require('path');
const cors = require("cors");
const sharp = require("sharp");
const app = express();

app.use(cors());

const walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};


app.get("/gallery/list", function (req, res) {
  fs.readdir("/Volumes/melvinchia/", function (err, files) {
    if (err) {
      res.send(err);
    } else {
      res.send(files.filter((e) => !e.startsWith(".")));
    }
  });
});

app.get("/gallery/image/list", function (req, res) {
  walk("/Volumes/melvinchia/" + req.query.g, function (err, files) {
    if (err) {
      res.send(err);
    } else {
      res.send(files.map(e => e.split(req.query.g, 2).pop()).filter((e) => !e.startsWith(".") && ['jpg', 'jpeg', 'png'].includes(e.split('.').pop().toLowerCase())));
    }
  });
});

app.get("/gallery/image/get", function (req, res) {
  if (fs.existsSync("/Volumes/melvinchia/" + decodeURIComponent(req.query.g) + "/" + decodeURIComponent(req.query.i))) {
    sharp("/Volumes/melvinchia/" + decodeURIComponent(req.query.g) + "/" + decodeURIComponent(req.query.i))
      .resize(256, 256)
      .rotate()
      .toFormat("jpeg")
      .toBuffer()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

app.listen(3001, function () {
  console.log("Listening on port 3001");
});
