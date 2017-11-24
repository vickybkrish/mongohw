var express = require('express');
var exphbs = require('express-handlebars');
var mongojs = require('mongojs');
var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}))

var Article = require('./models/Article.js');
var Review = require('./models/Review.js');

mongoose.connect("mongodb://heroku_0dw6n89v:mv3tpm5ujvihftkspkvgdmpk46@ds163721.mlab.com:63721/heroku_0dw6n89v");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(express.static('views'));

app.get('/', function(req, res) {
    Article.find({}, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            // console.log(data);
            res.render('index', {
                Article: data
            })
        }
    })
})

app.get('/scrape', function(req, res) {
    request('http://www.bbc.com/earth/world', function(error, response, html) {
        // console.log(html);
        var $ = cheerio.load(html);
        $('.promo-unit').each(function(i, element) {
            // console.log(element);
            var image = $(this).find('.replace-image').attr('href');
            var title = $(this).find('.promo-unit-title').html();
            var text = $(this).find('.promo-unit-summary').html();
            // console.log(image);
            // console.log(title);
            // console.log(text + '\n');
            var newArticle = new Article({
                image: image,
                title: title,
                text: text
            });
            newArticle.save(function(err, object) {
                if (err) return console.error(err);
                // console.log(object);
            })
        })
        res.send('complete');
    })
})

app.get('/favorites', function(req, res) {
    Article.find({
        favorite: true
    }, function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.render('favorites', {
                Article: data
            });
        }
    })
})

app.post('/favorites/:id', function(req, res) {
    var id = req.params.id;
    Article.findByIdAndUpdate(id, {
        $set: {
            favorite: true
        }
    }, {}, function(err, status) {
        if (err) return handleError(err);
        res.send('success');
    });
})

app.post('/remove/:id', function(req, res) {
    var id = req.params.id;
    Article.findByIdAndUpdate(id, {
        $set: {
            favorite: false
        }
    }, {}, function(err, status) {
        if (err) return handleError(err);
        res.send('success');
    });
})

app.get('/reviews/:id', function(req, res) {
    var id = req.params.id;
    // console.log(id);
    Article.findById(id)
        .populate('reviews')
        .exec(function(err, data) {
            res.json(data);
        })
})

app.post('/reviews/:id', function(req, res) {
    var id = req.params.id;
    var review = req.body.review;

    newReview = new Review({
        review: review
    });
    newReview.save(function(err, doc) {
        console.log(doc);
        Article.findByIdAndUpdate(id, {
            $push: {
                reviews: doc._id
            }
        }, function(error, doc) {

            Article.findById(id)
                .populate("reviews")
                .exec(function(error, data) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.json(data);
                    }
                });
        })
    })
})

app.post('/trash', function(req, res) {
    var id = req.body;
    // console.log(id);
    Article.findByIdAndUpdate(id.article, {$pull: {reviews: id.review}}, function(err, result) {
        Review.remove( {_id: id.review}, function(error, obj) {
            Article.findById(id.article)
                .populate("reviews")
                .exec(function(error, data) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.json(data);
                    }
                });
        });
    })
})

app.listen(port, function() {
    console.log('Server connected on port ' + port);
})
