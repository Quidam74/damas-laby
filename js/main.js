
var link = "http://srv-tpinfo.iut-acy.local:8080/"
var coinPosX = -1
var coinPosY =-1
var mePosX = -1
var mePosY = -1
var jsutOne = true
var totalPiece = 0
var totalPiecePrecedent = 0
var weNeedCoin = true
var weNeedMap = true
$(document).ready(function() {
	var valueTimeOut = 100
	var currentStep ="getMaze"


	setInterval(function(){
		if(weNeedMap){
			gotToCoin()
			weNeedMap = false
		}	else
		if(weNeedCoin){
			getCoin()
			weNeedCoin = false
		}else{
			switch (currentStep) {
				case "getMaze":
				getMaze()
				currentStep = "initPlayerPanel"
				break;
				case "initPlayerPanel":
				initPlayerPanel()
				currentStep = "getPlayers"
				break;
				initPlayerPanel

				case "getPlayers":
				getPlayers()
				currentStep = "gotToCoin"
				break;


				case "getCoin":
				getCoin()
				currentStep = "gotToCoin"
				break;
				case "gotToCoin":
				gotToCoin()
				currentStep = "getPlayers"
				break;

			}
		}

	}, valueTimeOut);


});


function getMaze(){
	$.post(link+"lab",
		{'pseudo' :'BELLANGER','password':'BELLANGER'},
		function(data){

			container = document.querySelector("main")
			var chaine = ""
			var length2 =data[0].length
			for (var i = 0; i < data[0].length ; i++) {
				chaine += "<div class='ligne'>"
				for (var n =0; n < data.length; n++) {
					if(data[n][i]==1)
						elem = "wall"
					else
						elem ="empty"
					chaine+="<div id='x"+n+"y"+i+"' class='block "+elem+"' data-posx='"+n+"'data-posy='"+i+"'></div>"
				}
				chaine += "</div>"
			}

			container.innerHTML = chaine

		},"json");
}

function initPlayerPanel(){
	$.post(link+"players",
		{'pseudo' :'BELLANGER','password':'BELLANGER'},
		function(data){
			if(data.error == null){
				document.querySelectorAll(".player").forEach(function(element) {
					becomeEmpty(element)
				});
				for (player in data) {
					document.querySelector("body").innerHTML += "<div id='"+player+"' class='playerPanel'>"+player+"</div>"
				}
			}
			else{
				console.log("error")
			}
		},"json");
}

function getPlayers(){

	

	totalPiece =0

	$.post(link+"players",
		{'pseudo' :'BELLANGER','password':'BELLANGER'},
		function(data){
			if(data.error == null){
				document.querySelectorAll(".player").forEach(function(element) {
					becomeEmpty(element)
				});
				for (player in data) {
					var a = document.querySelector("#x"+data[player].position.y+"y"+data[player].position.x)
					var rect = a.getBoundingClientRect();
					document.querySelector("#"+player).style.top =rect.top-20+"px"
					document.querySelector("#"+player).style.left =rect.left-(document.querySelector("#"+player).offsetWidth-a.offsetWidth)/2+"px"
					document.querySelector("#"+player).innerHTML = player +"/"+data[player].requests +"/"+data[player].score
					if(a != null)
						becomePlayer(a)
					totalPiece +=data[player].score

					if(jsutOne)
						if(player=="BELLANGER"){
							mePosY = data[player].position.y
							mePosX = data[player].position.x
							jsutOne = false

						}
					}

					if(totalPiecePrecedent!=totalPiece)
						weNeedCoin = true

						totalPiecePrecedent =totalPiece

				}
				else{
					console.log("error")
				}
			},"json");
	
}

function getCoin(){
	$.post(link+"coin",
		{'pseudo' :'BELLANGER','password':'BELLANGER'},
		function(data){
			document.querySelectorAll(".coin").forEach(function(elem){
				becomeEmpty(elem)
			})
			coinPosX = data.x
			coinPosY = data.y
			becomeCoin(document.querySelector("#x"+data.y+"y"+data.x))
		},"json");
}
function gotToCoin(){
	if(coinPosX==mePosX){
		goToX =0
	}else{
		if(coinPosX>mePosX)
		{
			goToX =1
			mePosX+=1
		}
		else{
			goToX = -1
			mePosX-=1
		}}
		if(coinPosY==mePosY){
			goToY =0
		}
		else{
			if(coinPosY>mePosY){
				goToY =1
				mePosY+=1
			}
			else{
				goToY = -1
				mePosY-=1
			}
		}

		if(goToX==0&&goToY==0)
			weNeedMap = true


		$.post(link+"move",
			{'pseudo' :'BELLANGER','password':'BELLANGER','v':{'x':goToX, 'y':goToY} },
			function(data){



			},"json");

	}
	function becomePlayer(elem){
		elem.classList.remove("empty")
		elem.classList.add("player")
	}

	function becomeEmpty(elem){
		elem.classList.remove("player","coin")
		elem.classList.add("empty")
	}

	function becomeCoin(elem){
		elem.classList.remove("player","empty")
		elem.classList.add("coin")

	}