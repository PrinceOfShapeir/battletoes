const admin = require('firebase-admin');
const functions = require('firebase-functions');
//const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const express = require('express');


const frontend = express();

frontend.use(bodyParser.json());

frontend.use(helmet({
	contentSecurityPolicy: {
		
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'"],
			scriptSrc: ["'self'","'unsafe-eval'", 'https://cdnjs.cloudflare.com/ajax/libs/synaptic/1.1.4/synaptic.js', 'https://code.jquery.com/jquery-3.3.1.js']
  }
	},
	hidePoweredBy: {
		setTo: 'super-nes lite server'
	}
}));

frontend.post("/loadAi", (req, res) => {
	
	var winners = db.collection('winners').doc('fEpWPZRtv6wlroTtjN2O');

	
	winners.get().then( (docRef) => {
		
		if(docRef.exists){
		
		
		//let payload = JSON.parse(doc.brain);
		let brain = docRef.get('brain');
		//brain = brain.brain;
		return res.send(brain);
		
	}
	
	else {
		return "not found";
	}
	}).catch( (e) => {
		console.error(e);
		throw e;
	});
	
	 
	
});

frontend.post("/updateStats", (req, res) => {
	
	if(req.body){
		//balanced ternary input
		if(!isNaN(req.body.outcome)){
			let a = 2;//if unchanged, logs as error
			try {
				a = parseInt(req.body.outcome);
			}
			
			catch(e){
				console.error(e);
				throw e;
			}
			
			let stats = db.collection("stats").doc("globals");
			
			switch(a){
				
				case 0:
					db.runTransaction( transaction => {
						
						return transaction.get(stats)
						.then(doc => {
							let newStats = JSON.parse(JSON.stringify(doc.data()));
							newStats.totalGames = doc.data().totalGames + 1;
							newStats.ties = doc.data().ties + 1;
							
							transaction.update(stats, newStats);
							return Promise.resolve(newStats);
							});
						}).then(result => {
							//console.log(result);
							return res.send(result);
							
						}).catch(e => {
							console.error(e);
							throw e;
						});
				
					
					break;
				case 1:
					db.runTransaction( transaction => {
						
						return transaction.get(stats)
						.then(doc => {
							
							let newStats = JSON.parse(JSON.stringify(doc.data()));
							newStats.totalGames = doc.data().totalGames + 1;
							newStats.totalWins = doc.data().totalWins + 1;
							
							transaction.update(stats, newStats);
							return Promise.resolve(newStats);
							});
						}).then(result => {
							return res.send(result);
						}).catch(e => {
							console.error(e);
							throw e;
						});				
					break;
				case -1:
					db.runTransaction( transaction => {
						
						return transaction.get(stats)
						.then(doc => {
							
							let newStats = JSON.parse(JSON.stringify(doc.data()));
							newStats.totalGames = doc.data().totalGames + 1;
							newStats.totalLosses = doc.data().totalLosses + 1;
							
							transaction.update(stats, newStats);
							return Promise.resolve(newStats);
							});
						}).then(result => {
							return res.send(result);
						}).catch(e => {
							console.error(e);
							throw e;
						});
									
					break;
				default:
				console.error("unbalanced input detected" + "recieved: " + req.body );
					break;
				
				
			}
			
			
		}
			
		
		
		else {
			
			console.error("bad input, " + "recieved: " + req.body);
		}
		
	}
	
	else {
		
		console.warn("empty update request");
		
	}
	
	
	
	
});


frontend.get("*", (req, res) => {

	res.sendFile(path.join(__dirname, '/public/home.html'));
});


//this was used to initialize the collection

/*
frontend.get("/UPDATEWINNERS", (req, res) => {
	
	let winners = db.collection("winners");
	
	winners.doc("fEpWPZRtv6wlroTtjN2O").set({
		
		name: "Primo",
		brain: fs.readFileSync('LastWinner.txt'),
		wins: 0,
		ties: 0,
		losses: 0
		
	});
	
	
	res.send('<html>HERE YA GO YA BASTARD</html>');
	
	
});
*/


const frontendExport = functions.https.onRequest(frontend);




module.exports = {

	frontendExport
}

/*

exports.saveTrainData = functions.https.onRequest((req, res) => {
	
if(req.method == 'POST'){
if(!req.query.trainData) {
return null;
}

	const newData = req.query.trainData;

	return db.collection("trainData").doc("wins").update({

	endgames: firebase.firestore.FieldValue.arrayUnion(newData)
}).then() => {
	res.end()};


}
else res.end();

	});*/
