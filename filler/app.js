var express = require("express"),
    colors = require("colors"),
    fs = require("fs");

var app = express();
var blacklist = ["app.js", "package.json"];

var currentdir = __dirname;
var previousdir = __dirname;

var log = function(msg) {
    console.log("filler > ".red + msg);
}

app.get("/", function(req, res) {
    previousdir = currentdir;
    currentdir = __dirname;

    dir(currentdir, function(html) {
        res.send(html);
    }, true);
});

app.get("/download", function(req, res) {
    res.download("./" + req.query.file);
});

app.get("/folder", function(req, res) {
    //app.use('/folder', express.static(currentdir + "/" + req.query.dir));
    dir(currentdir + "/" + req.query.dir, function(html) {
        res.send(html);
        previousdir = currentdir;
        currentdir = currentdir + "/" + req.query.dir;
    }, false);
});

app.get("/up", function(req, res) {
    var isRoot;
    if (previousdir == __dirname) {
        isRoot = true;
    } else {
        isRoot = false;
    }

    dir(previousdir, function(html) {
        currentdir = previousdir;
        previousdir = currentdir.substring(0, currentdir.lastIndexOf("/"));
        res.send(html);
    }, isRoot);
});

app.get("/irc", function(req, res) {
    res.redirect("http://dev.kurisubrooks.com:8080/");
});

//app.use('/', express.static(__dirname + '/'));

app.listen(8080);
log("started server");

function dir(name, callback) {
    var html;
    fs.readdir(name, function(err, files, isRoot) {
        if (err) log(err);
        html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="style.css"><link href="Caramel.css" rel="stylesheet"></head><body><div class="container">' + "<h1>/public_html</h1><hr>";
        if (isRoot == false) {
            html = html + "<span id='folder'><a href='/up'>..</a></span><br>";
        }
        for (var folder in files) {
            if (files[folder].indexOf(".") == -1) {
                html = html + "<span id='folder'><i class='fa fa-fw fa-folder'></i>&nbsp;<a href='/folder?dir=" + files[folder] + "'>" + files[folder] + "</a></span><br>";
            }
        }
        for (var file in files) {
            if (files[file].indexOf(".") != -1 && blacklist.indexOf(files[file]) == -1) {
                html = html + "<span id='file'><i class='fa fa-fw fa-file'></i>&nbsp;<a href='/" + files[file] + "'>" + files[file] + "</a></span><br>";
            }
        }
        html = html + "</div></body></html>";
        callback(html);
    });
}
