// set an card namr array
var GOT_array = ['Cersei','Melisandre','Sansa','Arya','Night_king','Daenerys','Eddard','Jon_snow','Jaime','Joffrey','Jon_snow','Cersei','Margaery','Joffrey','Margaery','Sansa','Daenerys','Melisandre','Tyrion','Arya','Jaime','Tyrion','Night_king','Eddard'];
var temp_values = [];
var temp_card_ids = [];
var flipped = 0;
var tried = 0;

Array.prototype.scramble = function(){ //random card position
    var j, temp;
    for(var i = this.length-1 ; i > 0 ; --i)
    {
		j = Math.floor(Math.random() * (i+1));
		//console.log("i = "+ i+" & j = " +j);
        temp = this[j];
        //console.log("temp = "+ temp);
        this[j] = this[i];
        //console.log("array j = "+ this[j]+" & array i = " +this[i]);
        this[i] = temp;
    }
}

function newBoard(){ // draw board game
	flipped = 0;
	var output = "";
    GOT_array.scramble();
	for(var i = 0; i < GOT_array.length; i++){
		output += '<div id="card_'+i+'" class="flip3D" onclick="flipCard(this,\''+ GOT_array[i]+'\')"></div>';
		//console.log(this+" "+ GOT_array[i]);
	}
	document.getElementById('gameBoard').innerHTML = output; // place a card
	startTimer();
}

function flipBack(){ // Flip all card back
	// reset card
	var card1 = document.getElementById(temp_card_ids[0]);
	var card2 = document.getElementById(temp_card_ids[1]);
	card1.style.background = 'url(img/GOT.png) no-repeat';
    card1.innerHTML = "";
	card2.style.background = 'url(img/GOT.png) no-repeat';
    card2.innerHTML = "";
    document.getElementById('tried').innerHTML = "Your have tried : "+tried+" times,&nbsp";
	resetTemp();
}

function resetGame(){ // restart game
	document.getElementById('gameBoard').innerHTML = "";
	document.getElementById('score').innerHTML = "Your score : 0";
	document.getElementById('tried').innerHTML = "Your have tried : 0 time,&nbsp";
	tried = 0;
	resetTimer();
	newBoard(); // new game
	resetTemp();
}

function resetTemp(){ // reset temp array
	temp_values = [];
    temp_card_ids = [];
}

function flipCard(card, value){
	if(card.innerHTML == "" && temp_values.length < 2){ // Check if card is not click and number of flip cards are not more than 2
		card.style.background = 'url(img/'+value+'.png) no-repeat';
		card.innerHTML = value; // Set value flag
		if(temp_values.length == 0){ // if this is the first flipped card -> add value to compare
			temp_values.push(value);
			temp_card_ids.push(card.id);
		} else if(temp_values.length == 1){ // if this is the second flipped card -> add value to compare
			temp_values.push(value);
			temp_card_ids.push(card.id);
			if(temp_values[0] == temp_values[1]){ // compare the first and second card
				flipped += 2; // set number of flipped card
				document.getElementById('score').innerHTML = "Your score : "+flipped/2;
				resetTemp();
				if(flipped == GOT_array.length){ // Check to see if the entire board is cleared
					pauseTimer();
					alert("Congratulation! You are the conqueror of the Westeros. It takes "+ minutes+":"+seconds+" minutes. Let's play again!");
					resetGame();
				}
			} else {
				++tried;
				setTimeout(flipBack, 800); // set time of hold the card if card isn't match. Time: 0.8 second
			}
		}
	}
}

function buildTime(t) {
    minutes = t.getMinutes();
    seconds = t.getSeconds();
    hours = t.getHours();
    if (minutes < 10) {
        minutes = "0"+minutes;
    }
    if (seconds < 10) {
        seconds = "0"+seconds;
    }
    if (hours > 0) {
        return "Time "+hours+":"+minutes+":"+seconds;
    } else {
        return "Time "+minutes+":"+seconds;
    }
}
 
function startTimer() { // start timer
    time = new Date();
    time.setSeconds(0); // Sets seconds to 0
    time.setMinutes(0); // Sets minutes to 0
    time.setHours(0);   // Sets hours to 0
    document.getElementById("timer").innerHTML = buildTime(time); // buildTime(time) returns 00:00
    // Update seconds, to be executed every second or 1000 miliseconds
	function changeTimer() {
    	time.setSeconds(time.getSeconds()+1);
    	document.getElementById("timer").innerHTML = buildTime(time);
	}
    // Set Interval to every second
    interval = setInterval(changeTimer, 1000);
}
 
function pauseTimer() {
    clearInterval(interval); // Pauses timer for popup
}
 
function resetTimer() { // Reset timer to 00:00
    time = "";
    clearInterval(interval); // Clear interval
    document.getElementById("timer").innerHTML = "Time 00:00"; // Put timer to 0's
}

// Add/Check/Set Cookies

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user=getCookie("username");
    if (user != "") {
        alert("Welcome back commander " + user +"!");
    } else {
       user = prompt("Welcome to the game. Please enter your name:","");
       if (user != "" && user != null) {
           setCookie("username", user, 30); // set cookie time for 1 month
       }
    }
}

// delete cookie (Switch Player)

function delete_cookie( name ) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// AJAX Retrieve the content of an XML file

function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      myFunction(xhttp);
    }
  };
  xhttp.open("GET", "GOTtable.xml", true);
  xhttp.send();
}
function myFunction(xml) {
  var i;
  var xmlDoc = xml.responseXML;
  var table="<tr><th>Picture</th><th>Name</th></tr>";
  var x = xmlDoc.getElementsByTagName("GOT");
  for (i = 0; i <x.length; i++) { 
    table += "<tr><td><img src='" +
    x[i].getElementsByTagName("PICTURE")[0].childNodes[0].nodeValue +
    "'></td><td>" +
    x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue +
    "</td></tr>";
  }
  document.getElementById("table").innerHTML = table;
}