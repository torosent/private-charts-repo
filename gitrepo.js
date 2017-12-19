let nodegit = require("nodegit");
require('dotenv-extended').load();
var promisify = require("promisify-node");
var fse = promisify(require("fs-extra"));
var httpserver = require("./httpserver");

let gitRepo = process.env.GIT_REPO;
let gitUsername = process.env.GIT_USERNAME;
let gitPassword = process.env.GIT_PASSWORD;
let gitType = process.env.GIT_TYPE || "github";
let path = "/tmp/" + gitUsername;

callback = {
    credentials: function () {
        if (gitUsername !== "" && gitPassword !== "") {
            if (gitType === "github") {
                return nodegit.Cred.userpassPlaintextNew(gitPassword, "x-oauth-basic");
            } else if (gitType === "bitbucket") {
                return nodegit.Cred.userpassPlaintextNew(gitUsername, gitPassword);
            }
            else {
                return nodegit.Cred.defaultNew();
            }
        }
    },
    certificateCheck: function () {
        return 1;
    }
};

var clone_opts = {
    fetchOpts: {
        callbacks: callback
    }
};

var pull_opts = {
    callbacks: callback
};


exports.cloneRepo = function () {
    // Clone a given repository into the `./tmp` folder.
    fse.removeSync(path);

    nodegit.Clone(gitRepo, path, clone_opts)
        .done(function (repo) {
            if (repo instanceof nodegit.Repository) {
                console.info("cloned " + gitRepo);
                httpserver.initHttpServer(path);
            } else {
                console.error("Something broke :(");
            }
        });
};

exports.pullChanges = function (cb) {
    nodegit.Repository.open(path)
        .then(function (repo) {
            repository = repo;
            return repository.fetchAll(pull_opts);
        })
        .then(function () {
            return repository.mergeBranches("master", "origin/master");
        })
        .done(function () {
            console.info("pulled changes");
            cb();
        });
}