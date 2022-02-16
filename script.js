// figure another way to disable clickable inputs
// only validate word on enter?

let word = "nerds";
let list = document.getElementsByClassName("letters");
let data = JSON.parse(dictionary);

// creates inputs, sets attributes, adds event listeners
function createGrid() {
    let grid = document.getElementById("word-grid");
    for (let i = 0; i < 30; i++) {
        let square = document.createElement("input");
        square.setAttribute("maxlength", "1");
        square.setAttribute("onkeypress", "return /[a-z]/i.test(event.key)");
        square.setAttribute("oninput", `checkSquare(${i});`);
        square.setAttribute("tabindex", "-1");
        if (i === 0) {
            square.setAttribute("autofocus", "");
        }
        else {
            square.setAttribute("disabled", "");
        }
        square.classList.add("letters", `${i}`);
        square.addEventListener("keyup", function(event) {
            if (event.key === "Backspace") {
                deleteSquare(i);
            }
        })
        grid.appendChild(square);
    }
}

function checkSquare(num) {
    if (num % 5 === 4) {
        if (verifyWord(num)) {
            console.log("correct");
            // if guess is completely correct
        }
        else {
            // if guess is not right, continue to next row
            console.log("wrong");
            changeLetter(num);
        }
    }
    else {
        // if word is not complete
        changeLetter(num);
    }
}

function changeLetter(num) {
    if (num + 1 == list.length) {
        // if sixth word is compelted
        console.log("last num");
    }
    else {
        // continue to next square
        list[num + 1].removeAttribute("disabled");
        list[num + 1].focus();
    }
}

function deleteSquare(num) {
    list[num - 1].value = "";
    list[num - 1].focus();
}

// checks if submission = word
function verifyWord(num) {
    for (let c; c < list.length; c++) {
        list[c].setAttribute("disabled", "");
    }

    let guess = "";
    for (let j = 4; j >= 0; j--) {
        guess += list[num - j].value;
    }

    let valid = false;

    for (let b = 0; b < data.length; b++) {
        if (guess === data[b]) {
            valid = true;
        }
    }

    if (valid === true) {
        for (let k = 4; k >= 0; k--) {
            if (guess[4 - k] === word[4 - k]) {
                // console.log("perfect letter match!");
                list[num - k].style.backgroundColor = "red";
            }
    
            else {
                for (l = 0; l < 5; l++) {
                    if (guess[4 - k] === word[l]) {
                        // console.log("minor letter match!");
                        list[num - k].style.backgroundColor = "blue";
                    }
                }
            }
    
        }
    }
    
    else {
        // word not valid
        console.log("invalid word");
    }

    return guess === word;
}