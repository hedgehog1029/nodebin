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
        res.send("<html><head><link rel='stylesheet' href='style.css' /></head><body>");
        res.send("<h1>Kurisu~ Files</h1>");
        for (var file in files) {
            res.send("<hr><a href='/download?file=" + files[file] + "'>" + files[file] + "</a>");
        }
        res.send("</body></html>");
    });
});

app.get("/download", function(req, res) {
    res.download("./" + req.query.file);
});

app.get("/irc", function(req, res) {
    res.redirect("http://dev.kurisubrooks.com:8080/");
});

app.listen(8080);
