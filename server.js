let mysql = require('mysql');
let config = require('./config.js');
const fetch = require('node-fetch');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { response } = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));


app.post('/api/loadUserSettings', (req, res) => {

	let connection = mysql.createConnection(config);
	let userID = req.body.userID;

	let sql = `SELECT mode FROM user WHERE userID = ?`;
	console.log(sql);
	let data = [userID];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();
});


app.post('/api/getMovies', (req, res) => {

	//create connection to sql, declare query in string
	let connection = mysql.createConnection(config);
	let sql = `SELECT * FROM movies`;
	console.log(sql);
	let data = [];

	// connecting to sql and using the query variable, turning data into JSON object and sending back as res
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message)
		}

		let string = JSON.stringify(results);

		console.log(string);

		res.send({express: string});
	});
	connection.end();
});

app.post('/api/addReview', (req, res) => {
	let userID = req.body.userID;
	let reviewTitle = req.body.reviewTitle;
	let reviewContent = req.body.reviewContent;
	let reviewScore = req.body.reviewScore;
	let movieID = req.body.movieID;
	console.log("UserID: " + userID);
	console.log("Review Title: " + reviewTitle);
	console.log("Review Content: " + reviewContent);
	console.log("Review Score: " + reviewScore);
	console.log("MovieID: " + movieID);

	let connection = mysql.createConnection(config);

	let sql = `INSERT INTO Review(userID, reviewTitle, reviewContent, reviewScore, movieID) VALUES (?, ?, ?, ?, ?)`;
	let data = [userID, reviewTitle, reviewContent, reviewScore, movieID];

	console.log(sql);
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = "Record has been added!"

		console.log(string);

		res.send({express: string});
	});
	connection.end();
});

app.post('/api/getTopMovies', (req, res) => {
	let genre = req.body.chosenGenre;

	//create connection to sql, declare query in string
	let connection = mysql.createConnection(config);
	let sql = `SELECT m.name, m.year, AVG(r.reviewScore) as avg 
	FROM movies m, Review r 
	WHERE r.movieID = m.id AND
	m.id IN (SELECT movie_id FROM movies_genres WHERE genre = ?)
	GROUP BY m.name, m.year 
	ORDER BY AVG(r.reviewScore) DESC 
	LIMIT 5`;
	console.log(sql);
	let data = [genre];

	// connecting to sql and using the query variable, turning data into JSON object and sending back as res
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message)
		}

		let string = JSON.stringify(results);

		console.log(string);

		res.send({express: string});
	});
	connection.end();
});

app.post('/api/getGenres', (req, res) => {

	//create connection to sql, declare query in string
	let connection = mysql.createConnection(config);
	let sql = `SELECT DISTINCT genre FROM movies_genres`;
	console.log(sql);
	let data = [];

	// connecting to sql and using the query variable, turning data into JSON object and sending back as res
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message)
		}

		let string = JSON.stringify(results);

		console.log(string);

		res.send({express: string});
	});
	connection.end();
});

app.post('/api/getSearchedMovies', (req, res) => {
	let searchTitle = req.body.searchTitle ;
	let searchActor = req.body.searchActor;
	let searchDirector =  req.body.searchDirector;
	console.log("Search Terms: Title: " + searchTitle + ", Actor Name: " + searchActor + ", Director Name: " + searchDirector);

	//create connection to sql, declare query in string
	let connection = mysql.createConnection(config);
	let data = [];
	let sql = `SELECT m.id, m.name, scores.average, GROUP_CONCAT(r.reviewContent SEPARATOR ', ') as reviewList, CONCAT(d.first_name, " ", d.last_name) as directorFullName 
	FROM movies m
	LEFT JOIN Review r ON r.movieID = m.id 
	INNER JOIN movies_directors md ON m.id = md.movie_id 
	INNER JOIN directors d ON d.id = md.director_id
	LEFT JOIN (SELECT movieID, AVG(reviewScore) as average FROM Review GROUP BY Review.movieID) AS scores ON m.id = scores.movieID`;

	if (searchTitle || searchActor || searchDirector) {
		sql += " WHERE ";
	}

	if(searchTitle) {
		sql += "m.name = ?";
		data.push(searchTitle);
	}

	if(searchTitle && searchActor) {
		sql += "AND ";
	}

	if(searchActor) {
		sql += "m.id IN (SELECT m.id FROM movies m RIGHT JOIN roles ro ON ro.movie_id = m.id INNER JOIN actors a ON a.id = ro.actor_id WHERE CONCAT(a.first_name, ' ', a.last_name) = ?)";
		data.push(searchActor);
	}

	if((searchTitle || searchActor) && searchDirector) {
		sql += "AND ";
	}

	if(searchDirector) {
		sql += "CONCAT(d.first_name, ' ', d.last_name) = ?";
		data.push(searchDirector);
	}

	sql += " GROUP BY m.id, m.name, scores.average, directorFullName ORDER BY m.name";

	console.log(sql);
	console.log(data);

	// connecting to sql and using the query variable, turning data into JSON object and sending back as res
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message)
		}

		let string = JSON.stringify(results);

		console.log("Results: " + string);

		res.send({express: string});
	});
	connection.end();
});


//app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
