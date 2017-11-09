/*** TODO ***
- Try to stop numbers re-aligning when digit is a 1
*/
var clockName = document.getElementsByTagName("h3")[0], clockFace = document.querySelector(".clock"), playing = document.querySelector(".playing");
var sessionDuration = document.querySelector(".odometer"), breakDuration = document.querySelectorAll(".odometer")[1];
var sessionLength = parseInt(document.querySelector(".session-odometer").innerHTML, 10), breakLength = parseInt(document.querySelector(".break-odometer").innerHTML, 10);
var sessionArrow = document.querySelectorAll(".session-arrow"), breakArrow = document.querySelectorAll(".break-arrow"), arrowClass = document.querySelectorAll(".fa");
var startButton = document.querySelector(".start-button"), startButtonClass = startButton.classList, resetButton = document.querySelector(".reset-button");
var sessionSeconds = sessionLength * 60, counter = 1, breakSeconds = breakLength * 60, interval, timerDisplay = document.querySelector(".timer");;

function setClockColour(backgroundColour, fontColour, text = "") {
  clockFace.style.background = backgroundColour;
  clockName.style.color = fontColour;
  playing.innerHTML = text;
}

// Change session length up and down
for (var i = 0; i < sessionArrow.length; i++) {
  sessionArrow[i].addEventListener("click", function() {
    var upOrDown = this.className;
    // handle session time change when timer has been stopped midway through session
    if (!startButtonClass.contains("on")) {
    reset();
    // session length up arrow pressed
    if (upOrDown == "fa fa-arrow-up session-arrow") {
      sessionLength += 1;
      sessionSeconds += 60;
      sessionDuration.innerHTML = sessionLength;
    // session length down arrow pressed
    } else {
      sessionLength -= 1;
      sessionSeconds -= 60;
      if (sessionLength < 1) {
        sessionLength = 1;
        sessionSeconds = 60;
      }
      sessionDuration.innerHTML = sessionLength;
    }
  }
    if (sessionSeconds != 0) {
      displayTime(sessionSeconds);
    }
  });
}

// Change break length up and down
for (var i = 0; i < breakArrow.length; i++) {
  breakArrow[i].addEventListener("click", function() {
    var upOrDown = this.className;
    if (!startButtonClass.contains("on")) {
    if (upOrDown == "fa fa-arrow-up break-arrow") {
      breakLength += 1;
      breakSeconds += 60;
      breakDuration.innerHTML = breakLength;
    } else {
      breakLength -= 1;
      breakSeconds -= 60;
      if (breakLength < 1) {
        breakLength = 1;
      }
      breakDuration.innerHTML = breakLength;
    }
  }
  });
}

function countdown() {
  var alarm = new Audio(['alarm.mp3']);
  if (sessionSeconds > -1) {
    sessionSeconds -= 1;
    displayTime(sessionSeconds);
    setClockColour("#99CC45", "black", "Time to work!"); 
    // alarm sounds when timer is 0
    if (sessionSeconds == 0) {
      alarm.play();
    }
  } 
  if (sessionSeconds < 0 && breakSeconds > 0) {
    breakSeconds -= 1;
    displayTime(breakSeconds);
    setClockColour("#af113b", "black", "Break time!");
    // alarm sounds when timer is 0
    if (breakSeconds == 0) {
      alarm.play();
    }
  }
  // reset break and session values to continue countdown
  if (sessionSeconds < 0 && breakSeconds == 0) {
    sessionSeconds = sessionLength * 60;
    breakSeconds = breakLength * 60;
  }
}

function startTimer() {
  // call countdown function every second while timer is running
  interval = setInterval(countdown, 1000);
  startButtonClass.add("on");
  // don't allow session and break length arrows to be pressed while timer is running
  for (var i = 0; i < arrowClass.length; i++) {
    arrowClass[i].classList.add("disabled");
  }
}

function pauseTimer() {
  // stops countdown function being called every second
  clearInterval(interval);
  startButtonClass.remove("on");
  // allow session and break length arrows to be pressed while timer is stopped
  for (var i = 0; i < arrowClass.length; i++) {
    arrowClass[i].classList.remove("disabled");
  }
  setClockColour("#000", "white");
}

function reset() {
  sessionSeconds = sessionLength * 60;
  displayTime(sessionSeconds);
}

startButton.addEventListener("click", function() {
  // maybe look to change this to boolean expression
  // toggles timer on and off when start/stop button is pressed
  counter++; 
  if (counter % 2 == 0) {
    startTimer();
  } else {
    pauseTimer();
  }
});

resetButton.addEventListener("click", function() {
  reset();
});

// Get timer to display session time
function displayTime(time) {
  var minutes = Math.floor(time / 60), remainderSeconds = time % 60;
  remainderSeconds < 10 ? timerDisplay.innerHTML = minutes + ":0" + remainderSeconds : timerDisplay.innerHTML = minutes + ":" + remainderSeconds;
}

// show session length within timer initially
displayTime(sessionSeconds);