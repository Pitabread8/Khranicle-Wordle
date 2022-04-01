// to-do:
// when word AND guess have same repeat letters
// when guess has three repeat letters and word has that letter

let word = "nerds";
let list = document.getElementsByClassName("letters");
let data = JSON.parse(dictionary);
let currentSquareID = 0;
let rowID = 0;

// Centralize Event Capture
document.addEventListener('keyup', e => {
    if (e.key.length === 1 && e.key.match(/[a-z]/gi)?.length === 1){
        let square = document.querySelector(`div[squareid="${currentSquareID}"][rowid="${rowID}"]`);
        if (!square) return console.log(rowID, currentSquareID);

        square.appendChild(document.createTextNode(e.key).cloneNode(true));
        currentSquareID++;
	} else if (['Enter', 'Return'].includes(e.key)) {
        let square = document.querySelector(`div[squareid="${currentSquareID+1}"][rowid="${rowID}"]`);
        if (!square) verifyWord();
	} else if (e.key === 'Backspace') {
        let square = document.querySelector(`div[squareid="${currentSquareID-1}"][rowid="${rowID}"]`);
        if (!square) return;

        square.removeChild(square.childNodes[0]);
		currentSquareID--;
	}
});

// Manages what to do when the game is over
document.addEventListener('gameover', () => {
    let guesses = Array.from(document.getElementsByClassName("letters"))
        .map(e => e.classList.toString().replace('letters','').trim())
        .filter(e => e.length)
        .map(e =>  Object.create({
                g:'🟩',
                y:'🟨',
                n:'⬛'  
            })[e]
        ).reduce((p, c, i) => p += (i+1) % 5 === 0 ? `${c}\n` : c, '');
    let tries = rowID > 5 ? 'X' : rowID+1;

    let shouldCopy = window.confirm(`KLS Wordle ${tries}/6\n\n${guesses}\n\nPress "Okay" to copy your results`);
    if (shouldCopy) 
        navigator.clipboard.writeText(`KLS Wordle ${tries}/6\n\n${guesses}`)
        .then(() => alert('Copied!'));
});

// Creates inputs, sets attributes, adds event listeners
function createGrid() {
    let grid = document.getElementById("word-grid");
    for (let i = 0; i < 30; i++) {
        let square = document.createElement("div");
        square.setAttribute("maxlength", "1");
        square.setAttribute("squareid", `${i}`);
        square.setAttribute("rowid", `${Math.floor(i/5)}`);
        square.setAttribute("tabindex", "-1");
        if (i === 0) {
            square.setAttribute("autofocus", "");
        }
        else {
            square.setAttribute("disabled", "");
        }
        square.classList.add("letters");
        grid.appendChild(square);
    }
}

// checks if submission = word
/**
 * word nerds
 * gues nosrs
 * enum gnnyg
 */
function verifyWord() {
    let guessElems = Array.from(document.getElementsByClassName('letters'))
        .filter(e => {
            let squareid = parseInt(e.attributes.getNamedItem('squareid').value)
            return squareid - (squareid % 5) === currentSquareID - 5;
        });
    let guess = guessElems.map(e => e.textContent).join('');

    // Check if word exists
    if (!data.includes(guess)) return alert("Not a valid word");

    let wenum = new Array(5).fill('n');
    
    // Green check
    for (let i = 0; i < word.length; i++) {
        if (word[i] === guess[i]) {
            wenum[i] = "g"
        } 
    }

    // Yellow check 
    for (let i = 0; i < word.length; i++) {
        let dcheck = guess.split('');
        dcheck.splice(i, 1, '!');
        dcheck = dcheck.join("");

        // If (the letter is in the word) and (the letter is not already green or yellow) and (another instance of this letter is not green or yellow)
        if (word.includes(guess[i]) && wenum[i] === "n" && !['g','y'].includes(wenum[dcheck.indexOf(guess[i])]))
            wenum[i] = "y";
    }

    // Update UI
    for (let i = 0; i < word.length; i++) {
        guessElems[i].classList.add(wenum[i]);
    }

    // Check if game over
    if (wenum.join('') === new Array(5).fill('g').join('')) {
        return document.dispatchEvent(new CustomEvent('gameover'));
    }

    rowID++;
}