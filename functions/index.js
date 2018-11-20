const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fs = require('fs');
//const body-parser = require('body-parser');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const express = require('express');


const frontend = express();

frontend.post("/loadAi", (req, res) => {
	
	var winners = db.collection('winners').doc('fEpWPZRtv6wlroTtjN2O');

	
	winners.get().then( (docRef) => {
		
		if(docRef.exists){
		
		
		//let payload = JSON.parse(doc.brain);
		let brain = docRef.get('brain');
		//brain = brain.brain;
		res.send(brain);
		
	}
	
	else {
		console.log("not found");
	}
	}).catch( (e) => {
		
		console.log(e);
	});
	
	 
	
});

/*
frontend.get("*", (req, res) => {

	res.send('<html>HERE YA GO YA BASTARD</html>');
});*/


//this was used to initialize the collection


frontend.get("/UPDATEWINNERS", (req, res) => {
	
	var winners = db.collection("winners");
	
	winners.doc("fEpWPZRtv6wlroTtjN2O").set({
		
		name: "Primo",
		brain: fs.readFileSync('LastWinner.txt'),
		wins: 0,
		ties: 0,
		losses: 0
		
	});
	
	
	res.send('<html>HERE YA GO YA BASTARD</html>');;
	
	
});



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
