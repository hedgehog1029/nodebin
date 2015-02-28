var express = require("express"),
    colors = require("colors"),
    fs = require("fs");

var app = express();
var blacklist = ["app.js", "package.json"];

var currentdir = __dirname;
var previousdir = __dirname;
var relativedir = "";

var isRoot;
var away;

var log = function(msg) {
    console.log("filler > ".red + msg);
}

app.get("/", function(req, res) {
    log("root served");

    previousdir = currentdir;
    currentdir = __dirname;
    relativedir = "";

    away = 0;

    isRoot = true;
    dir(currentdir, function(html) {
        res.send(html);
    });
});

app.get("/download", function(req, res) {
    res.download("./" + req.query.file);
});

app.get("/folder", function(req, res) {
    log("folder served");

    relativedir = relativedir + "/" + req.query.dir;
    away = away + 1;
    isRoot = false;
    dir(currentdir + "/" + req.query.dir, function(html) {
        res.send(html);
        previousdir = currentdir;
        currentdir = currentdir + "/" + req.query.dir;
    });
});

app.get("/up", function(req, res) {
    log("up req served");

    away = away - 1;

    if (away == 0) {
        log("refusing because root");
        isRoot = true;
        relativedir = "";
    } else {
        log("allowing because not root");
        isRoot = false;
        relativedir = relativedir.substring(0, relativedir.lastIndexOf("/"));
    }

    dir(previousdir, function(html) {
        currentdir = previousdir;
        previousdir = currentdir.substring(0, currentdir.lastIndexOf("/"));
        res.send(html);
    });
});

app.get("/irc", function(req, res) {
    res.redirect("http://dev.kurisubrooks.com:8080/");
});

app.use('/f/', express.static(__dirname + '/'));

app.listen(8080);
log("started server");

function dir(name, callback) {
    var html;
    fs.readdir(name, function(err, files) {
        if (err) log(err);
        html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/f/style.css"><link href="/f/Caramel.css" rel="stylesheet"></head><body><div class="container">' + "<h1>/public_html" + relativedir + "</h1><hr>";
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
                html = html + "<span id='file'><i class='fa fa-fw fa-file'></i>&nbsp;<a href='/f" + relativedir + "/" + files[file] + "'>" + files[file] + "</a></span><br>";
            }
        }
        html = html + "</div></body></html>";
        callback(html);
    });
}
