// Dependency
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// Create a CommentSchema with the Schema calss
var CommentSchema = new Schema({
    text: {
        type: String,
        unique: true
    }
});

// Create the Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

//Export the Comment model
module.exports = Comment;


