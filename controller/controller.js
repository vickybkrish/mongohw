var Product = require("../models/Product.js");
var Comment = require("../models/Comment.js");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function (app) {
    // Root populates all saved Products
    app.get("/", function(req, res) {
        Product.find().populate("comments").exec(function(error, found) {
            if (error) {
                res.end();
            }
            else {
                res.render("index", {products: found})
            }
        })
    });
    // Route to scrape data from another site
    app.get("/scrape", function (req, res) {
        request("https://www.dotmed.com/equipment/newest", function(error, response, html){
        // load page into cheerio 
            if (error) {
                console.log(error)
            }
            var $ = cheerio.load(html);
              $("dl.auctions").each(function(i, element) {
                // var name = $(element).find('dt.listing_head h3 a ').text().trim();
                var name = $(element).children("dt.listing_head").children("a").text().trim() + "";

                // var route = $(element).find('dt.listing_head h3 a ').attr("href").trim();
                var link = $(element).children("dt.listing_head").children("a").attr("href");

                var price = $(element).find('div.datePosted p').text().trim();
                // var price = $(element).children("dl.datePosted").children("dd").children("p").text().trim();

                // var link = "https://www.dotmed.com" + route;
            
                if (name && link && price) {
                    var saveProduct = new Product({name: name, link: link, price: price});
                    saveProduct.save(function(error, saved) {
                        if (error) {
                            console.log(error)
                        }
                    })
                }
            })
        })
        res.redirect("/");
    });
    // Route to post comments
    app.post("/comment", function (req, res) {
        var saveComment = new Comment({text: req.body.comment});
        saveComment.save(function(error, doc) {
            if (error) {
                res.send(error);
            }
            else {
                Product.findOneAndUpdate({}, {$push: {"comments": doc._id}}, {new: true}, function(error, newdoc) {
                    if (error) {
                        res.send(error);
                    }
                    else {
                        res.redirect("/");
                    }
                });
            }
        })
    })

}

