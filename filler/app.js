var express = require("express"),
    colors = require("colors"),
    fs = require("fs");

var app = express();

var log = function(msg) {
    console.log("filler >".red + msg);
}

app.get("/", function(req, res) {
    fs.readdir(__dirname, function(err, files) {
        if (err) log(err);

    });
});

app.get("/irc", function(req, res) {
    res.redirect("http://dev.kurisubrooks.com:8080/");
});

app.listen(8080);
