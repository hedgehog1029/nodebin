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
        var html = "<html><head><link rel='stylesheet' href='style.css' /></head><body><h1>Kurisu's Files</h1><hr>";
        for (var file in files) {
            html = html + "<a href='/download?file=" + files[file] + "'>" + files[file] + "</a><br>";
        }
        html = html + "</body></html>";
        res.send(html);
    });
});

app.get("/download", function(req, res) {
    res.download("./" + req.query.file);
});

app.get("/irc", function(req, res) {
    res.redirect("http://dev.kurisubrooks.com:8080/");
});

app.listen(8080);
