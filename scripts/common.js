// Get modal element
const modal = document.getElementById("choosePlayerModal");

// Get button that opens the modal
const openModalBtn = document.getElementById("openModalBtn");
const gameCost_Modal = document.getElementById("gameCost_Modal");
const gameResult = document.getElementById("gameResult");

// Get the <span> element that closes the modal
const closeModal1 = document.getElementById("close1");
const closeModal2 = document.getElementById("close2");
const closeModal3 = document.getElementById("close3");
const undoBtn = document.getElementById("undo");
const resultHeader = document.getElementById("resultModalHeader");

// html body div#gameResult.modal div.modal-content h2

window.addEventListener("load", function () {
  loadDataFromLocalStorage(); // Load data from localStorage after the page is loaded
  resultsScore(); // add score for each player next to the name
});

//Load all scores on page load
function loadDataFromLocalStorage() {
  document.getElementById((id = `player1_Mountain`)).textContent = String(
    localStorage.getItem(`1_Mountain`) || "..."
  );
  document.getElementById((id = `player2_Mountain`)).textContent = String(
    localStorage.getItem(`2_Mountain`) || "..."
  );
  document.getElementById((id = `player1_Pool`)).textContent = String(
    localStorage.getItem(`1_Pool`) || "..."
  );
  document.getElementById((id = `player2_Pool`)).textContent = String(
    localStorage.getItem(`2_Pool`) || "..."
  );
  document.getElementById((id = `player1_Whist`)).textContent = String(
    localStorage.getItem(`1_Whist`) || "..."
  );
  document.getElementById((id = `player2_Whist`)).textContent = String(
    localStorage.getItem(`2_Whist`) || "..."
  );
}

let bulletPoints = 0;
let player1_Name = "Anton";
let player2_Name = "Olena";
let currentPlayer = "";
let whistPlayer = "";
let currentScore = 0;
let currentScoreString = "";
let currentWhistScore = "";
let currentWhistScoreString = "";
let currentMountainScore = "";
let currentMountainScoreString = "";
let playersTricks = 0;
let currentGame = 0;
let currentGameCost = 0;
let requiredWhist = 0;
let raspasCount = 0;
let scoreRas = 0;
let mizerGame = false;
let player1_dealer = true;
let deal_image =
  '<img src="./src/1804142.png" alt="Current dealer" width="30" />';

document.getElementById((id = "player1_Name")).innerHTML =
  (player1_dealer ? deal_image + "  " : "") + player1_Name;

document.getElementById((id = "player2_Name")).innerHTML =
  (!player1_dealer ? deal_image + "  " : "") + player2_Name;

// When the user clicks the button "Start game", open the modal with option to choose the player
openModalBtn.onclick = function () {
  modal.style.display = "flex";
  document.getElementById("option1").innerText = player1_Name;
  document.getElementById("option2").innerText = player2_Name;
};

undoBtn.onclick = function () {
  localStorage.clear();
  restorePreviousStorage();
  location.reload();
};

// When the user clicks on <span> (x), close the modal
closeModal1.onclick = function () {
  modal.style.display = "none";
};
closeModal2.onclick = function () {
  gameCost_Modal.style.display = "none";
};
closeModal3.onclick = function () {
  gameResult.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Handle option buttons
function setBulletPoints(contract) {
  raspasCount = 0;
  let whoPlays = ""; // used for the question on UI - who plays
  currentPlayer == 1 ? (whoPlays = player1_Name) : (whoPlays = player2_Name);
  resultHeader.innerText = `How many twicks did ${whoPlays} take?`;
  currentGameCost = contract;
  gameCost_Modal.style.display = "none";
  gameResult.style.display = "flex";
  console.log("Current game cost: ", currentGameCost);
}

//When user sets the player -> the options for the current game is shown
document.getElementById("option1").onclick = function () {
  gameCost_Modal.style.display = "flex"; // open the modal with game types
  modal.style.display = "none"; // Close modal after selection
  currentPlayer = 1;
  whistPlayer = 2;
};

document.getElementById("option2").onclick = function () {
  gameCost_Modal.style.display = "flex";
  modal.style.display = "none"; // Close modal after selection
  currentPlayer = 2;
  whistPlayer = 1;
  raspasCount = 0;
};
// Raspasovka option
document.getElementById("option3").onclick = function () {
  resultHeader.innerText = `How many twicks did ${player1_Name} take?`;
  modal.style.display = "none";
  gameResult.style.display = "flex";
  currentPlayer = 1;
  raspasCount++;
  console.log(raspasCount);
};

// Handle game types choice
// currentGame - required tricks
document.getElementById("game-option1").onclick = function () {
  setBulletPoints(2);
  currentGame = 6;
  requiredWhist = 4;
};
document.getElementById("game-option2").onclick = function () {
  setBulletPoints(4);
  currentGame = 7;
  requiredWhist = 2;
};
document.getElementById("game-option3").onclick = function () {
  setBulletPoints(6);
  currentGame = 8;
  requiredWhist = 1;
};
document.getElementById("game-option4").onclick = function () {
  setBulletPoints(8);
  currentGame = 9;
  requiredWhist = 0;
};
document.getElementById("game-option5").onclick = function () {
  setBulletPoints(10);
  currentGame = 10;
  requiredWhist = 0;
};
// mizer
document.getElementById("game-option6").onclick = function () {
  setBulletPoints(10);
  mizerGame = true;
  console.log("mizerGame", mizerGame);
  currentGame = 10;
  requiredWhist = 0;
};

function updateMountain(player, score) {
  currentMountainScore = Number(
    localStorage.getItem(`${player}_Mountain_Total`)
  )
    ? Number(localStorage.getItem(`${player}_Mountain_Total`))
    : 0;

  currentMountainScoreString = String(
    localStorage.getItem(`${player}_Mountain`)
  )
    ? String(localStorage.getItem(`${player}_Mountain`))
    : "";

  localStorage.setItem(
    `${player}_Mountain`,
    currentMountainScoreString == "null"
      ? Number(score)
      : currentMountainScoreString + ". " + Number(currentMountainScore + score)
  );
  localStorage.setItem(
    `${player}_Mountain_Total`,
    currentMountainScore + Number(score)
  );
  document.getElementById((id = `player${player}_Mountain`)).textContent =
    String(localStorage.getItem(`${player}_Mountain`));
}

function updatePool(player, score) {
  currentScore = Number(localStorage.getItem(`${player}_Pool_Total`))
    ? Number(localStorage.getItem(`${player}_Pool_Total`))
    : 0;
  currentScoreString = String(localStorage.getItem(`${player}_Pool`))
    ? String(localStorage.getItem(`${player}_Pool`))
    : "";
  console.log(
    "currentScoreString ",
    currentScoreString,
    "isNull",
    currentScoreString.isNull
  );
  console.log("currentScore", currentScore);
  localStorage.setItem(
    `${player}_Pool`,
    currentScoreString == "null"
      ? Number(score)
      : currentScoreString + ". " + Number(currentScore + score)
  );
  localStorage.setItem(`${player}_Pool_Total`, currentScore + Number(score));
  document.getElementById((id = `player${player}_Pool`)).textContent = String(
    localStorage.getItem(`${player}_Pool`)
  );
}

function updateWhist(player, score) {
  currentWhistScore = Number(localStorage.getItem(`${player}_Whist_Total`))
    ? Number(localStorage.getItem(`${player}_Whist_Total`))
    : 0;
  currentWhistScoreString = String(
    localStorage.getItem(`${player}_Whist_Total`)
  )
    ? String(localStorage.getItem(`${player}_Whist_Total`))
    : "";

  localStorage.setItem(
    `${player}_Whist`,
    currentWhistScoreString == "null"
      ? Number(score)
      : currentWhistScoreString + ". " + Number(currentWhistScore + score)
  );
  localStorage.setItem(
    `${player}_Whist_Total`,
    currentWhistScore + Number(score)
  );
  document.getElementById((id = `player${player}_Whist`)).textContent = String(
    localStorage.getItem(`${player}_Whist`)
  );
}

//// Handle game results
document.getElementById("results-option0").onclick = function () {
  playersTricks = 0;
  runResultsCalculation();
};
document.getElementById("results-option1").onclick = function () {
  playersTricks = 1;
  runResultsCalculation();
};
document.getElementById("results-option2").onclick = function () {
  playersTricks = 2;
  runResultsCalculation();
};
document.getElementById("results-option3").onclick = function () {
  playersTricks = 3;
  runResultsCalculation();
};
document.getElementById("results-option4").onclick = function () {
  playersTricks = 4;
  runResultsCalculation();
};
document.getElementById("results-option5").onclick = function () {
  playersTricks = 5;
  runResultsCalculation();
};
document.getElementById("results-option6").onclick = function () {
  playersTricks = 6;
  runResultsCalculation();
};
document.getElementById("results-option7").onclick = function () {
  playersTricks = 7;
  runResultsCalculation();
};
document.getElementById("results-option8").onclick = function () {
  playersTricks = 8;
  runResultsCalculation();
};
document.getElementById("results-option9").onclick = function () {
  playersTricks = 9;
  runResultsCalculation();
};
document.getElementById("results-option10").onclick = function () {
  playersTricks = 10;
  runResultsCalculation();
};

// function for undo last game results
function storePreviousScores() {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    previousLocalStorage[key] = localStorage.getItem(key);
  }
}
//// new one
function runResultsCalculation() {
  console.log("playersTricks", playersTricks);
  console.log("currentGame", currentGame);
  console.log("currentGameCost", currentGameCost);
  console.log("current rasspass: ", raspasCount);
  console.log(currentPlayer);
  function chekPool() {
    if (playersTricks >= currentGame) {
      updatePool((player = currentPlayer), currentGameCost);
    }
  }
  function checkMountain() {
    if (!raspasCount) {
      if (playersTricks < currentGame) {
        console.log("Mount should be added");
        updateMountain(
          (player = currentPlayer),
          currentGameCost * (currentGame - playersTricks)
        );
      }
    } else {
      if (playersTricks < 10 - playersTricks) {
        scoreRas = (10 - playersTricks - playersTricks) * raspasCount;
        currentPlayer = 2;
      } else if (playersTricks > 10 - playersTricks) {
        scoreRas = (playersTricks - (10 - playersTricks)) * raspasCount;
      } else if (playersTricks == 10 - playersTricks) {
        scoreRas = 0;
      }
      updateMountain((player = currentPlayer), scoreRas);
    }
  }
  function checkWhists() {
    if (playersTricks <= currentGame) {
      updateWhist(
        (player = whistPlayer),
        currentGameCost * (10 - playersTricks + (currentGame - playersTricks))
      );
    } else
      updateWhist(
        (player = whistPlayer),
        currentGameCost * (10 - playersTricks)
      );
  }
  function checkWhistMointain() {
    if (10 - playersTricks < requiredWhist) {
      updateMountain(
        (player = whistPlayer),
        currentGameCost * (requiredWhist - (10 - playersTricks))
      );
    }
  }
  storePreviousScores();
  if (mizerGame) {
    if (playersTricks > 0) {
      scoreRas = playersTricks * currentGame;
      updateMountain((player = currentPlayer), scoreRas);
    } else if (playersTricks == 0) {
      updatePool(currentPlayer, currentGame);
    }
    gameResult.style.display = "none";
    mizerGame = false;
  } else {
    if (!raspasCount) {
      chekPool();
      checkWhists();
      checkWhistMointain();
    }
    checkMountain();
    gameResult.style.display = "none";
  }

  console.log("previousLocalStorage", previousLocalStorage);
  resultsScore();
}
let previousLocalStorage = [];

function restorePreviousStorage() {
  for (let key in previousLocalStorage) {
    console.log("1:  ", `${key}: ${previousLocalStorage[key]}`);
    console.log("2:  ", key, previousLocalStorage[key]);

    localStorage.setItem(key, previousLocalStorage[key]);
  }
}

function resultsScore() {
  const aimPool = 20;
  // read all current data from local storage and save them as variables
  let player1_Mountain = Number(
    localStorage.getItem(`1_Mountain_Total`) || "0"
  );
  let player2_Mountain = Number(
    localStorage.getItem(`2_Mountain_Total`) || "0"
  );
  let player1_Pool = Number(localStorage.getItem(`1_Pool_Total`) || "0");
  let player2_Pool = Number(localStorage.getItem(`2_Pool_Total`) || "0");
  let player1_Whist = Number(localStorage.getItem(`1_Whist_Total`) || "0");
  let player2_Whist = Number(localStorage.getItem(`2_Whist_Total`) || "0");

  console.log(
    "player1_Mountain",
    player1_Mountain,
    "player2_Mountain",
    player2_Mountain,
    "player1_Pool",
    player1_Pool,
    "player2_Pool",
    player2_Pool,
    "player1_Whist",
    player1_Whist,
    "player2_Whist",
    player2_Whist
  );

  // add Mountain for player with not enough pool
  if (player1_Pool < aimPool) {
    player1_Mountain = player1_Mountain + (aimPool - player1_Pool) * 2;
    player1_Pool = aimPool;
  }
  if (player2_Pool < aimPool) {
    player2_Mountain = player2_Mountain + (aimPool - player2_Pool) * 2;
    player2_Pool = aimPool;
  }
  // adjust Mountain
  if (player1_Mountain < player2_Mountain) {
    player2_Mountain = player2_Mountain - player1_Mountain;
    player1_Whist = player1_Whist + player2_Mountain * 10;
    player1_Mountain = 0;
  } else if (player1_Mountain == player2_Mountain) {
    player1_Mountain = 0;
    player2_Mountain = 0;
  } else if (player1_Mountain > player2_Mountain) {
    player1_Mountain = player1_Mountain - player2_Mountain;
    player2_Whist = player2_Whist + player1_Mountain * 10;
    player2_Mountain = 0;
  }

  let midWhist = (player1_Whist + player2_Whist) / 2;
  player1_Whist = player1_Whist - midWhist;
  player2_Whist = player2_Whist - midWhist;
  // if (player1_Whist < player2_Whist) {
  //   player2_Whist = player2_Whist - player1_Whist;
  //   player1_Whist = 0;
  // } else if (player1_Whist == player2_Whist) {
  //   player2_Whist = 0;
  //   player1_Whist = 0;
  // } else if (player1_Whist > player2_Whist) {
  //   player1_Whist = player1_Whist - player2_Whist;
  //   player2_Whist = 0;
  // }

  let resultsPl1 = player1_Whist - player2_Whist;
  let resultsPl2 = player2_Whist - player1_Whist;
  player1_dealer = !player1_dealer;
  document.getElementById("player1_Name").innerHTML =
    (player1_dealer ? deal_image + "  " : "") +
    player1_Name +
    " (" +
    resultsPl1 +
    ")";

  document.getElementById("player2_Name").innerHTML =
    (player1_dealer ? "" : deal_image + "  ") +
    player2_Name +
    " (" +
    resultsPl2 +
    ")";
}
