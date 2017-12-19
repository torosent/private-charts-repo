let express = require('express');
let app = express();
let path = require('path');
let git = require("./gitrepo");

let port = process.env.PORT || 8080

exports.initHttpServer = function (dirpath) {
    app.get('/*', function (req, res) {
        git.pullChanges(() => {
            console.info("Sending " + dirpath + req.url);            
            res.sendFile(dirpath + req.url);
        });
    });

    app.listen(port);
    console.info("Listening on port: " + port);
}
