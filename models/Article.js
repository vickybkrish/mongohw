var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    image: {
        type: String
    },
    title: {
        type: String,
        index: {
            unique: true
        }
    },
    text: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    favorite: {
        type: Boolean,
        default: false
    }
})

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
