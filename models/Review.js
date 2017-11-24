var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    review: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
})

var Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
