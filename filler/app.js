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
        var html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="style.css"><link href="Caramel.css" rel="stylesheet"></head><body><div class="container">' + "<h1>/public_html</h1><hr>";
        for (var folder in files) {
            if (files[folder].indexOf(".") == -1) {
                html = html + "<span id='folder'><i class='fa fa-fw fa-folder'></i>&nbsp;<a href='/folder?f=" + files[folder] + "'>" + files[folder] + "</a></span><br>";
            }
        }
        for (var file in files) {
            if (files[file].indexOf(".") != -1) {
                html = html + "<span id='file'><i class='fa fa-fw fa-file'></i>&nbsp;<a href='/download?file=" + files[file] + "'>" + files[file] + "</a></span><br>";
            }
        }
        html = html + "</div></body></html>";
        res.send(html);
    });
});

app.get("/download", function(req, res) {
    res.download("./" + req.query.file);
});

app.get("/irc", function(req, res) {
    res.redirect("http://dev.kurisubrooks.com:8080/");
});

server.use('/', express.static(__dirname + '/'));

app.listen(8080);
