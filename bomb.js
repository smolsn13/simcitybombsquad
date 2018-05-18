console.log("javascript running");

var totalTime = 3000; //initial timer
var timeRemaining = 0; //initial time remaining
var gameOver = false; //stores whether or not bomb has been defused or exploded => either way game is over
var wiresToCut = [];
var successSong = null;

var delay = null;
var timer = null;

var wiresCut = {   //stores which wires have been cut already
  blue: false,
  green: false,
  red: false,
  white: false,
  yellow: false
}

var checkForWin = function() {
  return wiresToCut.length > 0 ? false : true; //if this is false, game is not over. True means game is over.
}

var detonate = function() {
  endGame(false);
}

var endGame = function(win) {
  gameOver = true;
  clearTimeout(delay);
  clearInterval(timer);
  if (win) {
    console.log("YOU SAVED THE CITY!");
    var yay = document.getElementById("yay");
    yay.addEventListener("ended", function() {
      successSong.play();
    });
    yay.play();
    document.querySelector(".timerbox p").style.color = "green";//we won!
  } else {
    console.log("BOOM!!!");//we lost
    document.getElementById("explode").play();
    document.body.classList.remove("unexploded");
    document.body.classList.add("exploded");
  }
}

var cutWire = function() {
  if(!wiresCut[this.id] && !gameOver) {
    //do the wirecut stuff and game checking here
    document.getElementById("buzz").play();
    this.src = "img/cut-" + this.id + "-wire.png";  //'this' represents the element obtained from DOM in getElementById => image
    wiresCut[this.id] = true;  //this.id is the color of the wire we just cut
    var wireIndex = wiresToCut.indexOf(this.id);
    if (wireIndex > -1) {
      //this is where the good cut logic goes
      console.log(this.id + " was correct!");
      wiresToCut.splice(wireIndex, 1);
      if (checkForWin()) {
        endGame(true);
      }
    } else {//this is where the bad cut logic goes
      delay = setTimeout(detonate, 750);
    }
  }
}

var reset = function() {
  gameOver = false;
  var wireImages = document.getElementsByClassName("imagebox")[0].children; //0 specifies the first element of that class, children references child elements of the imagebox class
  for (var i = 0; i < wireImages.length; i++) {
    wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
  }
  //reset background
  document.body.classList.add("unexploded");
  document.body.classList.remove("exploded");
  document.querySelector(".timerbox p").style.color = "red";

  clearTimeout(delay);
  clearInterval(timer);

  successSong.pause(); //Reset
  successSong.currentTime = 0; //Reset

  for (color in wiresCut) {
    wiresCut[color] = false;
  }
  initGame();
}

var updateClock = function() {
  timeRemaining--; //opposite of ++, decrement marker
  var seconds = 0;
  var hundredths = 0;

  if (timeRemaining >= 0) {
    seconds = Math.floor(timeRemaining / 100);
    hundredths = timeRemaining - (seconds * 100);
  } else {
    endGame(false);
  }
  var secondsString = seconds >= 10 ? seconds.toString() : "0" + seconds.toString();
  var hundredthsString = hundredths >= 10 ? hundredths.toString() : "0" + hundredths.toString();
  document.querySelector(".timerbox p").textContent = "0:00:" + secondsString + ":" + hundredthsString;
}

var initGame = function() {
  timeRemaining = totalTime;

  var allColors = Object.keys(wiresCut); //holds each of the keys from the object passed through, stores them in an array

  wiresToCut = allColors.filter(function() { //function iterates through allColors array and generates a random number, then returns true or false for each color
    var rand = Math.random();
    if (rand > 0.5) {
      return true;
    } else {
      return false;
    }
  });
  console.log(wiresToCut);
  timer = setInterval(updateClock, 10);
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("blue").addEventListener("click", cutWire);
  document.getElementById("green").addEventListener("click", cutWire);
  document.getElementById("red").addEventListener("click", cutWire);
  document.getElementById("white").addEventListener("click", cutWire);
  document.getElementById("yellow").addEventListener("click", cutWire);
  successSong = document.getElementById("success");
  document.getElementById("reset").addEventListener("click", reset);
  initGame();
});
