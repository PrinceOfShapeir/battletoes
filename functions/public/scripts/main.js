var board = new Array(9).fill(0.5);
	var boardCache;
	let computerToken;
	var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;
	var aiActive;
	let count = 0;
	let trainingData = [];
		
		

	let trainer;
	  
    let playerToken = false;


function main () {
	
	
    //sessionStorage.setItem("playerToken", playerToken);
   
    
    function setToken(token){
          
      //sessionStorage.setItem("playerToken", token);
      if(token<1){
        playerToken = "O";
        computerToken = "X";
        
      }
       else {
         playerToken = "X";
         computerToken = "O";
         }
       let tokens =  document.getElementById("tokens");
       tokens.parentNode.removeChild(tokens);
    }
    
    
$('#tokens').on('click', 'button', (res) => {
	setToken(res.target.id);

});
    
    
    function clicked(id){  
      
      if(playerToken){
      
      if(!document.getElementById(id).innerHTML){
        //playerToken = sessionStorage.getItem("playerToken");
        //square.id.value = playerToken;
        document.getElementById("turn").innerHTML = "Good Move!";
        document.getElementById(id).innerHTML = playerToken;
        //console.log("Did this.");
        //console.log(playerToken);
        console.log("changing" + board[id-1] + "to 0");
        board[id-1] = 0;
        count++;
        //console.log(board);
        aiToPlay();
      }
        else {
          
          document.getElementById("turn").innerHTML = "Move Already Taken!!!";
        }
      //do something
      }
      else{
        document.getElementById("turn").innerHTML = "Select Token!!";
      }
  }

$('#table').on('click', 'button', (res)=>{
	clicked(res.target.id);

});
    	  

function downloading(){
	
	downloadContents = "data:application/octet-stream," + encodeURIComponent(localStorage.saved);
	window.open(downloadContents, 'savedChar');
	
}
		
	  function setAi(){
	
	
	let download = function(){
	
	document.getElementById('download').innerHTML = 
	"<button id='downloadButton'>Click Here to Download Your Character</button>";
	
document.getElementById('downloadButton').addEventListener("click", downloading);
}
	
			if(!localStorage.getItem("saved")){
			
	
			  $.post("loadAi", (data) => {
				//console.log(data);
			  let a = JSON.parse(data);
			  aiActive = Network.fromJSON(a);
			  trainer = new Trainer(aiActive);
			  document.getElementById("turn").innerHTML = 
			  "<button id='play2'>click Here To Play Second!</button> Or Just Start Playing";
			  document.getElementById('play2').addEventListener("click", aiToPlay);
			  localStorage.saved = JSON.stringify(aiActive.toJSON());
			  download();

}).catch((e)=>{
			  
			  console.log("fucked up");
			  });
		  }
		  
		  
		  else if(!document.getElementById('aiInput').files[0]){
			aiActive = Network.fromJSON(JSON.parse(localStorage.saved));
			trainer = new Trainer(aiActive);
			  document.getElementById("turn").innerHTML = 
			  "Saved Char Loaded <button id='play2' >click Here To Play Second!</button> Or Just Start Playing";
				document.getElementById('play2').addEventListener("click", aiToPlay);
							  console.log(aiActive);
				download();

}

		  
		  
		  else if(document.getElementById('aiInput').files[0]){
			
			let reader = new FileReader();
			let tests = document.getElementById('aiInput').files[0];
			reader.onload = function (text){
				
				tests = text.target.result;
				
				
			let testregs = /neuron/;
			
			if(testregs.test(tests)){
				
				tests = JSON.parse(tests);
				aiActive = Network.fromJSON(tests);
				trainer = new Trainer(aiActive);
				
				
				document.getElementById("turn").innerHTML = 
				"Loaded from file! <button id='play2' >click Here To Play Second!</button> Or Just Start Playing";
				document.getElementById('play2').addEventListener("click", aiToPlay);
				
				download();
			}
			
			else {
				
				console.log("upload read error");
				
			}
				
			}  
			reader.readAsText(tests);
			
			
			  
		  }
		 
		 let dbutton = document.getElementById("aiInput");
		 dbutton.parentNode.removeChild(dbutton);
	
	  }
	  
	  document.getElementById('setai').addEventListener("click", setAi);
	  
	  function aiToPlay(){
		 console.log("AI Is Playing");

		 if(!check()){
			 
						if(trainingData.length>0){
			//let learner = Network.toJSON
			//console.log(trainingData);
			trainer.train(trainingData,{
				
				iterations: 200,
				cost: Trainer.cost.MSE
				
				
				});
			localStorage.saved = JSON.stringify(aiActive.toJSON());
			
		}
			
		
			 let b = board.slice();
		 let movesRated = new Array(9).fill(0);
		 for(i in b){
			 
			if(b[i]===0.5){
			 let newMove = b.slice();
			 newMove[i] = 1;
			 let newMoveRating = aiActive.activate(newMove);
			 //console.log(newMoveRating);
			 movesRated[i] = newMoveRating[0];
			// console.log(newMoveRating);
		 }/*
		 else {
			 movesRated[i]=0;
		 }*/
	 }
	 console.log(movesRated);
	 let move = movesRated.indexOf(Math.max.apply(Math,movesRated))+1;
		 boardCache = b.slice();
		 board[move-1] = 1;
		 if(!computerToken){
			 computerToken = "X";
		 }
		 console.log(move);
		 document.getElementById(move).innerHTML = computerToken;
		 count++;
		 
		 check();

}
	 
	 }
		

		function updatePull(s){
			
			//let a = JSON.parse(s);
			let a = s;
			
			localStorage.totalGames = a.totalGames;
			localStorage.totalWins = a.totalWins;
			localStorage.totalLosses = a.totalLosses;
			localStorage.totalTies = a.ties;
			
			document.getElementById("globals").innerHTML = String("Global Computer Wins: "+localStorage.totalWins+"<br>"+
			"Global Human Wins: "+localStorage.totalLosses+"<br>"+
			"Global Ties: "+localStorage.totalTies+"<br>"+
			"Global Games Played: "+localStorage.totalGames);
			
			
		}
	 
		function store(result){
			
			if(!localStorage.statsBatch){
					
			localStorage.statsBatch = [];
			}
			let outcome;
			
			switch(result){
				

				case 0:
					localStorage.ties = parseInt(localStorage.ties)+ 1;
					localStorage.gamesPlayed = parseInt(localStorage.gamesPlayed)+1;
					outcome = 0;
					$.post("updateStats",{
						outcome: outcome
					}).done( (newStats) => {
						
						updatePull(newStats);
						
						}).catch( (e) => {
							
							localStorage.statsBatch.push(outcome);
							
							console.log("error updating from server");
						
						});
						
					break;
					
				case 1:
					localStorage.gamesPlayed = parseInt(localStorage.gamesPlayed)+1;
					localStorage.computerWins = parseInt(localStorage.computerWins)+1;
					outcome = 1;
						$.post("updateStats",{
						outcome: outcome
					}).done( (newStats) => {
						
						updatePull(newStats);
						
						}).catch( (e) => {
							localStorage.statsBatch.push(outcome);
							console.log("error updating from server");
						
						});
						
					break;
					
				case -1:
					localStorage.humanWins = parseInt(localStorage.humanWins) + 1;
					localStorage.gamesPlayed = parseInt(localStorage.gamesPlayed) + 1;
					outcome = -1;
					$.post("updateStats",{
						outcome: outcome
					}).done( (newStats) => {
						
						updatePull(newStats);
						
						}).catch( (e) => {
							localStorage.statsBatch.push(outcome);
							console.log("error updating from server");
						
						});
						
					break;
					
				default:
				
					break;
				
				
			}
			
			
			
		}
	 
	 
		 function check(){
			 		
			 		if(win(board)||win(flip(board))||count===board.length){
						let boardcopy = board.slice();
						let boardCacheCopy = boardCache.slice();
			 
			 if(win(boardcopy)){
				 
				 trainingData = trainingData.concat([
				 {
					input: boardcopy,
					output: [1]
				},
				{
					input: flip(boardcopy),
					output: [0]
				 },
				 
				 {
					input: boardCacheCopy,
					output: [1]
				 },
				 
				 {
					input: flip(boardCacheCopy),
					output: [0]
				}			 
				 ]);
				 
				 store(1);
					
			 }//backpropagate 1, eventually will add two
			 
			 else if(win(flip(boardcopy))){
				 
				 trainingData = trainingData.concat([
				 
				 {
					 input: flip(boardcopy),
					 output: [1]
				 },
				 {
					 input: boardcopy,
					 output: [0]
				 },
				 
				 {
					input: boardCacheCopy,
					output: [0]
				 },
				 
				 {
					input: flip(boardCacheCopy),
					output: [1]
				}		
				 
				 
				 ]);
				 store(-1);
			 }
			 
			 else {
				 
				 store(0);
				 
			 }
						
			 
			 document.getElementById("turn").innerHTML = "<button id='playagain'>play again?</button> <br><br> GOOD GAME";
			 	 
			document.getElementById('playagain').addEventListener("click", playAgain);
			   
			document.getElementById("stats").innerHTML = String("Computer Wins: "+localStorage.computerWins+"<br>"+
			"		Human Wins: "+localStorage.humanWins+"<br>"+
			"		Ties: "+localStorage.ties+"<br>"+
			"			Games Played: "+localStorage.gamesPlayed);
			 
			alert("GAME OVER");// eslint-disable-line no-alert
			 
			 
			 
			 
			 return true;
		 }
			 else return false;
		 }
		 
		 function playAgain(){
			 
			 /*
			if(trainingData.length>0){
			//let learner = Network.toJSON
			//console.log(trainingData);
			trainer.trainAsync(trainingData, {
				iterations: 200,
			cost: Trainer.cost.MSE
			}).then(results => {
				
				console.log("trained");
				console.log(results);	
			
			
			});
			

			
		}
		*/
	
			
			 
			 board.fill(0.5);
			 count = 0;
			 for(let i =1; i<=board.length; i++){
				 
				 document.getElementById(i).innerHTML = "";
			 }
			  document.getElementById("turn").innerHTML = 
			  "<button id='play2'>click Here To Play Second!</button> <br> Or Just Start Playing";
				document.getElementById('play2').addEventListener("click", aiToPlay);

}
			 /* let playover = document.getElementById("gameover");
			  playover.parentNode.removeChild(playover);*/
			
		 
		 
function reset(){
		 
		 alert("game reset");// eslint-disable-line no-alert
		 
		 playAgain();
	 }
	 
	 
	  document.getElementById("reset").innerHTML = String("<button id='resetbutton'>Reset</button>");
	  document.getElementById("resetbutton").addEventListener("click", reset);



	 }//main
	 
	 
	 
	 
	function initStats(){
	  if(!localStorage.gamesPlayed){
		  
		  localStorage.gamesPlayed = 0;
		  localStorage.computerWins = 0;
		  localStorage.humanWins = 0;
		  localStorage.ties = 0;
	  }
	  else {
		  			document.getElementById("stats").innerHTML = String("Computer Wins: "+localStorage.computerWins+
			"		Human Wins: "+localStorage.humanWins+
			"		Ties: "+localStorage.ties+
			"			Games Played: "+localStorage.gamesPlayed);
			
		  
	  }
	  
main();
  }
  
  window.addEventListener("load", initStats());
		 
	 
	 
