var request = require("request");
var express = require("express");
var router = express.Router();
var db = require("../models/");

var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");


router.get("/", function(req, res) {
    db.Article
        .find({})
        .then(function(data) {
            var hbsObject = {
                data: data
            };
            res.render("index", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.post("/:id?", function(req, res) {
    var localid = req.params.id;
    console.log(req.params.id);
    db.Article
        .find(localid).remove().exec()
        .then(function(data) {
            var hbsObject = {
                data: data
            };
            res.render("index", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
});





router.get("/scrape", function(req, res) {
    var total_records = 0;
    var hbsObject = {};
    request("http://www.nytimes.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        var result = {};

        $("h2.story-heading").each(function(i, element) {
            hbsObject = {};
            result.title = $(element).children().text().replace("\n", "").trim();
            result.link = $(element).children().attr("href");
            db.Article
                .create(result)
                .then(function(dbArticle) {
                    total_records += 1;
                    hbsObject = {
                        data: total_records
                    }
                })
                .catch(function(err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        return res.status(500).send({ succes: false, message: 'User already exist!' });
                    }
                });
        });

    });
    res.json(hbsObject);
});


// router.get("/:id?", function(req, res) {
//     db.Article
//         .find({})
//         .populate("note")
//         .then(function(dbArticle) {
//             var hbsObject = {
//                 data: dbArticle
//             };
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
//     response.render("index", hbsObject);
// });


// router.post("/api/comment", function(request, response) {
//     karma.insertcomment(request.body.activity_id, request.body.comment, function(data) {
//         var hbsObject = {
//             comment: data
//         };
//         response.render("comments", hbsObject);
//     });
// });

module.exports = router;