//Require Mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//Create Schema
var ProductSchema = new Schema ({
	name: {
		type: String,
		required: true,
		trim: true
	},

	link: {
		type: String,
		required: true
	},
	
	price: {
		type: String,
		required: true
	},
  	//Create a relationship with Comment Model
  	comment: [{
  		type: Schema.Types.ObjectId,
  		ref: "Comment"
  	}]

});

//Create Model from above Schema using mongoose
var Product = mongoose.model("Product", ProductSchema);

//Export Model
module.exports = Product;