let sample = null; // sample element
let answerBoxes = []; // array of answerBox elements
let choices = [] // array of choice elements
let correctAnswer = null; // color code of correct answer
let score = 0; // number of correct answers
let total = 0; // total number of questions asked
let clickCooldown = true; // stop user from clicking answers too fast
let gamemode = null; // variable storing the chosen gamemode
// variable storing the chosen difficulty
// can be 2 for easy, 4 for medium, 8 for hard
let difficulty = null; 
const NUM_QUESTIONS = 10;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}      

// initalize page
window.onload = function () {
  sample = document.getElementById("sample");
  choices = document.getElementsByClassName("choice");
  
  // add onclick events to choices
  for(let i = 0; i < choices.length; i++){
    choices[i].addEventListener('click', function () {
      makeChoice(this);
    });
  } // for
  
};

// mark the current question
function markIt(elem) {
  
  // check if clicking is allowed
  if(clickCooldown){
    return;
  }
  
  // if clicked, prevent clicking for the cooldown
  clickCooldown = true;
  let gotItRight = false;
  

  total++;
  
  //console.log("Compairing " + elem.innerHTML + " to " + correctAnswer);-------------------------------------------
  
  // record if it is correct
  if(elem.innerHTML == correctAnswer){
    score++;
    gotItRight = true;
  }
  
  document.getElementById('scoreOutOfMax').innerHTML = score + " / " + total;
  
  window.setTimeout(function(){
    
    if(gotItRight){
      sample.innerHTML = "Correct!";
    } else {
      sample.innerHTML = "Incorrect!";
    }
    
  }, 100);
  
  window.setTimeout(function(){
    if(total >= NUM_QUESTIONS){
      sample.style.backgroundColor = "#FFC100";
      sample.innerHTML = "Game Over!";
      for(let i = 0; i < answerBoxes.length; i++){
        answerBoxes[i].style.backgroundColor = "#FFC100";
        answerBoxes[i].innerHTML = "";
      } // for
      
    } else {
      loadNewQuestion();
      
      // re-enable clicking after generating new question
      window.setTimeout(function(){
        clickCooldown = false;
      }, 200);
      
    } // else
  }, 1300);
  
} // markIt

// save user's difficulty/color choice and toggle its selection
function makeChoice(elem){
  
  // checks if gamemode variable is not full and a gamemode choice was made
  if(!gamemode && elem.classList.contains("gamemodeChoice")){
    
    // sets difficulty to "hexToColor" or "colorToHex"
    gamemode = elem.id;
    
    elem.style.backgroundColor = "#FFC100";
    elem.style.transform = "scale(1.03)";
    
    // remove to prevent choice:hover css working
    document.getElementById("hexToColor").classList.remove("choice");
    document.getElementById("colorToHex").classList.remove("choice");
  }
  
  // checks if difficulty variable is not full and a difficulty choice was made
  else if(!difficulty && elem.classList.contains("difficultyChoice")){
    
    // sets difficulty to "easy", "medium", or "hard"
    difficulty = elem.id;
    
    elem.style.backgroundColor = "#FFC100";
    elem.style.transform = "scale(1.03)";
    
    // remove to prevent choice:hover css working
    document.getElementById("2").classList.remove("choice");
    document.getElementById("4").classList.remove("choice");
    document.getElementById("8").classList.remove("choice");
  }
  
  // if both settings have been selected, exit lightbox and start game
  if(gamemode && difficulty){
    window.setTimeout(function(){
      setupGame();
    }, 1000);
  } // if
}

// set up everything that depends on difficulty and gamemode
function setupGame(){
  
  // add class easyGrid, medumGrid, or hardGrid to have space for correct buttons
  document.getElementById("answerContainer").classList.add("grid" + difficulty);
  
  answerBoxes = document.getElementsByClassName("answerBox");
  
  // add onclick events to answers
  for(let i = 0; i < answerBoxes.length; i++){
    answerBoxes[i].addEventListener('click', function () {
      markIt(this);
    });
  } // for
  
  // unhide questions based on difficulty
  for(let i = 0; i < difficulty; i++){
    answerBoxes[i].classList.remove("hidden");
  } // for
  
  document.getElementById("lightbox").classList.add("hidden");
  
  loadNewQuestion();
  
  // re-enable clicking after generating new question
      window.setTimeout(function(){
        clickCooldown = false;
      }, 200);
}

// Load a new question
function loadNewQuestion() {
  // set the background color of sample
  let colorCode = getRandomHexCode();
  
  if(gamemode == "colorToHex"){
    sample.innerHTML = "";
    sample.style.backgroundColor = colorCode;
  } else {
    sample.innerHTML = colorCode;
  }
  
  // pick a random location for correct answer
  let solution = Math.floor(Math.random() * difficulty);
  for (let i = 0; i < difficulty; i++){
    
    // reset all html
    answerBoxes[i].innerHTML = "";
    
    // if the box is the answer box
    if (i == solution) {
      
      // if the sample has a colored background
      if(gamemode == "colorToHex"){
        answerBoxes[i].innerHTML = colorCode;
      } else {
        answerBoxes[i].style.backgroundColor = colorCode;
      } // else
    } // if
    
    // if the box isn't the answer box
    else {
      
      // if the sample has a colored background
      if(gamemode == "colorToHex"){
        answerBoxes[i].innerHTML = getRandomHexCode();
      } else {
        answerBoxes[i].style.backgroundColor = getRandomHexCode();
      } // else
    } // else
  } // for
  
  // store correct answer to this question globaly
  correctAnswer = colorCode;
  
} // loadNewQuestion

// create random hex code
function getRandomHexCode() {
  let result = []; // final code
  let hexRef = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']; // array of every possible hex digit
  
  result.push("#");
  for(let i = 0; i < 6; i++){
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  } // for
  
  return result.join(''); // #rrggbb
  
} // getRandomHexCode
