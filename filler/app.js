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
        var html = "<html><head><link rel='stylesheet' href='style.css'/><link href='Caramel.css' rel='stylesheet'/></head><body><h1>Kurisu's Files</h1><hr>";
        for (var folder in files) {
            if (folder.indexOf(".") == -1) {
                html = html + "<span id='folder'><i class='fa fa-folder'></i>&nbsp;<a href='/folder?f=" + files[folder] + "'>" + files[folder] + "</a></span><br>";
            }
        }
        for (var file in files) {
            html = html + "<span id='file'><i class='fa fa-file'></i>&nbsp;<a href='/download?file=" + files[file] + "'>" + files[file] + "</a></span><br>";
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
