//requiring packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var app = express();
var PORT = process.env.PORT || 3000;


var News = require("./models/News.js");
var Comment = require("./models/Comment.js");

mongoose.Promise = Promise;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");
mongoose.connect("mongodb://localhost/mongohw");
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose error", error);
});

db.once("open", function() {
	console.log("Mongoose made a connection");
});

//limiting page to 10 articles
app.get("/", function(req, res) {
	News.find({}).sort({$natural:-1}).limit(10).exec(function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			console.log(doc);
			res.render("index", {News: doc});
		}
	});
});

//allows user to favorite an article setting it to true when favorited
app.post("/favorites/:id", function(req, res) {
	News.where({"_id": req.params.id}).update({ $set: {saved: true}})
		.exec(function (error, doc) {
		
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

//Unfavoriting an article setting it back to false
app.post("/unfavorite/:id", function(req, res) {
	News.where({"_id": req.params.id}).update({ $set: {saved: false}})
		.exec(function (error, doc) {
		
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

//articles that have been favorited have been set to true and are displayed here
app.get("/favorites", function(req, res) {
	News.find({saved: true}).exec(function(error, doc) {
		if(error) {
			console.log(error);
		}
		else {
			res.render("favorites", {News: doc});
		}
	});
});

//gets any comments that have been saved
app.get("/comment/:id", function(req, res) {
	News.findOne({ "_id": req.params.id })
		.populate("comment")
		.exec(function(error, doc) {
			if (error) {
				console.log(error);
			}
			else {
				res.json(doc);
			}
		});
});


// posts/updates new comments
app.post("/comment/:id", function(req, res) {
	var newComment = new Comment(req.body);
	newComment.save(function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			News.findOneAndUpdate({ "_id": req.params.id}, {"comment": doc._id}).exec(function(error, doc) {
				if (error) {
					console.log(error);
				}
				else {
					res.send(doc);
				}
			});
		}
	});
});

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
