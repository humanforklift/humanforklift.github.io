//Link all buttons from document to variable, set ButtonStr to zero, initiate numbersArr, define screen variable, create variable to store last answer calculated
var buttons = document.getElementsByTagName("SPAN"), buttonStr = "0", numbersArr = [], screen = document.getElementsByClassName("main-display"), lastAnswer;

display(buttonStr);

// reset display and buttonStr to zero
function displayZero() {
    buttonStr = "0";
    display("0");
}

// prevents multiple zeros from being pressed
function preventZero() {
    displayZero();
}

// shows current value of numbers being pressed on screen
function display(buttonStr) {
    screen[0].innerHTML = buttonStr;
}

// clears numbersArr
function clearNumsArr() {
    while (numbersArr.length > 0) {
        numbersArr.pop();
    }
}

//Clear screen totally and reset buttonStr
function allClear() {
    displayZero();
    writeToWorkingArea("");
    clearNumsArr();
}

//displays numbers at top of screen once operator has been pressed
function writeToWorkingArea(str) {
    var screen = document.getElementsByClassName("working-area");
    screen[0].innerHTML = str;
}

//adds operator sign to top of screen
function operate(sign) {
    var length = numbersArr.length;
    
    // write buttonStr to working area on first operator press
    if (length == 0) {
        writeToWorkingArea(buttonStr + " " + sign);
    
    // write buttonStr stored in array to working area on subsequent operator presses
    } else {
        
        // insert operator sign into NumbersArr if not already present
        if (numbersArr[length - 1] != sign) {
            numbersArr.push(sign);
        } 
        writeToWorkingArea(numbersArr.join(" "));
    }
}

//add functionality to buttons
function buttonPress() {
    var buttonClass = this.className, key = this.innerHTML;
        
    if (buttonClass == "number") {
        numberPress(key);
    } else if (buttonClass == "operator") {
        operatorPress(key);
    } else if (buttonClass == "clear") {
        clearPress(key);
    } else if (buttonClass == "decimal") {
        decimalPress(key);
    } else if (buttonClass == "ans") {
        ansPress(key);
    } else {
        evaluate(key);
    }
}

function numberPress(value) {
    // handle first digit press
    if (buttonStr == 0 && (buttonStr.indexOf(".") == -1)) {
        
        // don't allow zero to be pressed if value is already zero
        if (value == 0) {
            writeToWorkingArea("0");
            preventZero();
        
        // handle first digit press when value stored in memory
        } else if (lastAnswer && numbersArr.length == 1) {
            allClear();
            buttonStr = "";
            buttonStr += value;
            display(buttonStr);
        
        // handle first digit press when memory is clear
        } else {
            buttonStr = value;
            display(buttonStr);
        }
    
    // handle subsequent digit presses
    } else {
        buttonStr += value;
        display(buttonStr);
    }
}

function operatorPress(value) {
    // only store number value in numbersArr if value is present
    if (buttonStr != "") {
        numbersArr.push(buttonStr);
    }
    operate(value);
    var length = numbersArr.length;
    // store buttonStr in array the first time an operator is pressed
    if (isNaN(numbersArr[length - 2])) {
        numbersArr.splice(length - 2, 1);
    }
    operate(value);

    // clear buttonStr for next series of values
    buttonStr = "";
}

// separate and add functionality for clear functions
function clearPress(value) {
    if (value == "AC") {
        allClear();
    } else {
        displayZero();
    }
}

// handle decimal point
function decimalPress(value) {
    // condition to ensure only 1 decimal point allowed
    if (buttonStr.indexOf(".") == -1) {
        buttonStr += value;
        display(buttonStr);
    }
}

// recall last answer calculated
function ansPress(value) {
    // clear screen if ANS pushed before next operator press
    if (numbersArr.length == 1) { 
        allClear();
    }
    buttonStr = lastAnswer;
    display(buttonStr);
}

// store operator functions
var operatorFuncs = {
    "+": function(a, b) {
        return parseFloat(a) + parseFloat(b);
    },
    "-": function(a, b) {
        return parseFloat(a) - parseFloat(b);
    },
    "*": function(a, b) {
        return parseFloat(a) * parseFloat(b);
    },
    "/": function(a, b) {
        return parseFloat(a) / parseFloat(b);
    },
    "%": function(a, b) {
        return parseFloat(a) % parseFloat(b);
    }
};

// handle equals button press
function evaluate(value) {
    var screen = document.getElementsByClassName("working-area"), operatorsArr = [];
    // handle eval press before operator has been pressed
    if (numbersArr.length == 0) {
        if (buttonStr == "") {
            displayZero();
        } else {
            display(buttonStr);
        }
    // handle eval press when a valid equation entered
    } else {
        numbersArr.push(buttonStr);
        if (!isNaN(parseInt(numbersArr[numbersArr.length - 1], 10))) {
            writeToWorkingArea(numbersArr.join(" "));
        } 
    }
    // Separates numbers and operators to different arrays to enable calculation
    for (var i = numbersArr.length; i > 0; i -= 2) {
        // copy operators present in numbersArr to operatorsArr
        if (numbersArr[i - 2]) {
            operatorsArr.push(numbersArr[i - 2]);
        }
        // remove operators from numbersArr
        if (i - 2 > 0) {
            numbersArr.splice((i - 2), 1);
        }
    }
    operatorsArr.reverse();

    // calculate answer from all values in numbersArr
    var cumulativeTotal = numbersArr.reduce(function (a, b, index) {
        return operatorFuncs[operatorsArr[index - 1]](a, b);
    });
    
    // handle NaN results
    isNaN(cumulativeTotal) ? display("That's incorrect Mathematics") : display(cumulativeTotal);
    
    // store answer in lastAnswer and numbersArr to re-use
    lastAnswer = cumulativeTotal.toString();
    clearNumsArr();
    numbersArr.push(lastAnswer);
    buttonStr = "";
}

//add click event to buttons
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", buttonPress);
}