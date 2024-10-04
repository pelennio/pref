import * as getScore from "./getScores.js";
import * as el from "./components.js";

let newPool;
let aimPool = localStorage.getItem("newPool") || 10;

window.addEventListener("load", function () {
  document.getElementById("poolText").textContent =
    localStorage.getItem("newPool") || 10;
  getScore.loadDataFromLocalStorage(); // Load data from localStorage after the page is loaded
  resultsScore(); // add score for each player next to the name
});

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
  '<img src="./src/1804142.png" alt="Current dealer" width="30" style="vertical-align: middle;" />';

document.getElementById("player1_Name").innerHTML =
  (player1_dealer ? deal_image + "  " : "") + player1_Name;

document.getElementById("player2_Name").innerHTML =
  (!player1_dealer ? deal_image + "  " : "") + player2_Name;

// When the user clicks the button "Start game", open the modal with option to choose the player
el.openModalBtn.onclick = function () {
  el.modal.style.display = "flex";
  document.getElementById("option1").innerText = player1_Name;
  document.getElementById("option2").innerText = player2_Name;
};

el.undoBtn.onclick = function () {
  restorePreviousStorage();
  location.reload();
};

// CLOSE MODALS
// When the user clicks on <span> (x), close the modal
document.querySelectorAll(".close").forEach((span) => {
  span.addEventListener("click", function () {
    const modalId = this.getAttribute("data-modal");
    // Close the modal associated with the clicked 'x'
    document.getElementById(modalId).style.display = "none";
  });
});

el.justCloseIt.onclick = function () {
  el.winnerCongrats.style.display = "none";
};

document.getElementById("cancelNewGame").onclick = function () {
  el.newGamePool.style.display = "none";
};

// Close modal when clicking outside the modal content
window.onclick = function (event) {
  // Check if the clicked element has the 'modal' class (i.e., the backdrop)
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

// Handle option buttons
function setBulletPoints(contract) {
  raspasCount = 0;
  let whoPlays = ""; // used for the question on UI - who plays
  currentPlayer == 1 ? (whoPlays = player1_Name) : (whoPlays = player2_Name);
  el.resultHeader.innerText = `How many twicks did ${whoPlays} take?`;
  currentGameCost = contract;
  el.gameCost_Modal.style.display = "none";
  el.gameResult.style.display = "flex";
  console.log("Current game cost: ", currentGameCost);
}

//When user sets the player -> the options for the current game is shown
document.getElementById("option1").onclick = function () {
  el.gameCost_Modal.style.display = "flex"; // open the modal with game types
  el.modal.style.display = "none"; // Close modal after selection
  currentPlayer = 1;
  whistPlayer = 2;
};

document.getElementById("localReset").onclick = function () {
  el.resetConfirmation.style.display = "flex";
};

document.getElementById("confirm").onclick = function () {
  el.resetConfirmation.style.display = "none"; // close modal confirmation
  el.newGamePool.style.display = "flex"; // open the modal with new game settings
};

el.cancelReset.onclick = function () {
  el.resetConfirmation.style.display = "none"; // open the modal with game types
};

el.confirmNewGame.onclick = function () {
  el.newGamePool.style.display = "none";
  localStorage.clear();
  newPool = document.getElementById("newGamePoolInput").value;
  localStorage.setItem("newPool", newPool);
  location.reload();
  document.getElementById("poolText").textContent =
    localStorage.getItem("newPool");
  document.getElementById("newGamePoolInput").value = 10;
};

el.setNewGameFromWinnerModal.onclick = function () {
  el.winnerCongrats.style.display = "none";
  el.newGamePool.style.display = "flex";
};

document.getElementById("option2").onclick = function () {
  el.gameCost_Modal.style.display = "flex";
  el.modal.style.display = "none"; // Close modal after selection
  currentPlayer = 2;
  whistPlayer = 1;
  raspasCount = 0;
};
// Raspasovka option
document.getElementById("option3").onclick = function () {
  el.resultHeader.innerText = `How many twicks did ${player1_Name} take?`;
  el.modal.style.display = "none";
  el.gameResult.style.display = "flex";
  currentPlayer = 1;
  raspasCount++;
  console.log(raspasCount);
};

function handleGameOption(
  bulletPoints,
  gameValue,
  whistValue,
  isMizer = false
) {
  setBulletPoints(bulletPoints);
  currentGame = gameValue;
  requiredWhist = whistValue;
  if (isMizer) {
    mizerGame = true;
  }
}

// Attach the click event to all game options
el.gameOption1.onclick = () => handleGameOption(2, 6, 4);
el.gameOption2.onclick = () => handleGameOption(4, 7, 2);
el.gameOption3.onclick = () => handleGameOption(6, 8, 1);
el.gameOption4.onclick = () => handleGameOption(8, 9, 0);
el.gameOption5.onclick = () => handleGameOption(10, 10, 0);
el.gameOption6.onclick = () => handleGameOption(10, 10, 0, true);

function updateMountain(player, score) {
  const currentMountainScore = getScore.getCurrentMountainScore(player);
  const currentMountainScoreString = getScore.getCurrentMountainString(player);
  const newScore = currentMountainScore + Number(score);
  const newMountainString =
    currentMountainScoreString == null
      ? String(score)
      : `${currentMountainScoreString}. ${newScore}`;

  // Update localStorage with new values
  localStorage.setItem(`${player}_Mountain`, newMountainString);
  localStorage.setItem(`${player}_Mountain_Total`, newScore);

  // Update UI with new mountain score
  document.getElementById(`player${player}_Mountain`).textContent =
    newMountainString;
}

let adjustedScore = 0;

function updatePool(player, score) {
  // Get current pool score for the player
  currentScore = getScore.getCurrentPoolScore(player);
  currentScoreString = getScore.getCurrentPoolString(player);

  if (currentScore + score > aimPool) {
    // When the score exceeds the aimPool limit, adjust to match the aimPool
    //case not covered when there is no mounting to be adjusted
    adjustedScore = aimPool - currentScore;
    updatePoolScore(player, adjustedScore);

    if (
      score - adjustedScore <
      aimPool - getScore.getCurrentPoolScore(whistPlayer)
    ) {
      // Update Whist score and the whistPlayer's pool
      updateWhist(player, (score - adjustedScore) * 10);
      updatePoolScore(whistPlayer, score - adjustedScore);
    } else {
      // Update whistPlayer's Whist score and handle overflow to Mountain
      updateWhist(
        player,
        (aimPool - getScore.getCurrentPoolScore(whistPlayer)) * 10
      );
      updatePool(
        whistPlayer,
        aimPool - getScore.getCurrentPoolScore(whistPlayer)
      );
      updateMountain(
        player,
        -(
          score -
          adjustedScore -
          (aimPool - getScore.getCurrentPoolScore(whistPlayer))
        )
      );
      /// and that is the end of the game
      // open window with Congrats
      getTheWinner();
    }
  } else if (currentScore + score == aimPool) {
    // If score does not exceed aimPool, simply update the pool score
    updatePoolScore(player, score);
    getTheWinner();
  } else {
    updatePoolScore(player, score);
  }

  // Helper function to update the player's pool score
  function updatePoolScore(player, score) {
    currentScore = getScore.getCurrentPoolScore(player);
    currentScoreString = getScore.getCurrentPoolString(player);
    // Store the new pool score in localStorage and update the UI
    localStorage.setItem(
      `${player}_Pool`,
      currentScoreString == null
        ? Number(score)
        : currentScoreString + ". " + Number(currentScore + score)
    );
    localStorage.setItem(`${player}_Pool_Total`, currentScore + Number(score));
    // Update the pool display on the webpage
    document.getElementById(`player${player}_Pool`).textContent =
      getScore.getCurrentPoolString(player);
  }
}

function updateWhist(player, score) {
  const currentWhistScore = getScore.getCurrentWhistScore(player);
  const currentWhistScoreString = getScore.getCurrentWhistString(player);
  const newScore = currentWhistScore + Number(score);
  const newWhistString =
    currentWhistScoreString == null
      ? String(score)
      : `${currentWhistScoreString}. ${newScore}`;

  // Update localStorage with new values
  localStorage.setItem(`${player}_Whist`, newWhistString);
  localStorage.setItem(`${player}_Whist_Total`, newScore);

  // Update UI with new whist score
  document.getElementById(`player${player}_Whist`).textContent = newWhistString;
}

// Function to handle results based on the number of tricks
function handleResultClick(tricks) {
  playersTricks = tricks;
  runResultsCalculation();
}

// Attach event listeners to all result options
for (let i = 0; i <= 10; i++) {
  document.getElementById(`results-option${i}`).onclick = () =>
    handleResultClick(i);
}

//// new one
function runResultsCalculation() {
  function chekPool() {
    if (playersTricks >= currentGame) {
      updatePool(currentPlayer, currentGameCost);
    }
  }
  function checkMountain() {
    if (!raspasCount) {
      if (playersTricks < currentGame) {
        console.log("Mount should be added");
        updateMountain(
          currentPlayer,
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
      updateMountain(currentPlayer, scoreRas);
    }
  }
  function checkWhists() {
    if (playersTricks <= currentGame) {
      updateWhist(
        whistPlayer,
        currentGameCost * (10 - playersTricks + (currentGame - playersTricks))
      );
    } else updateWhist(whistPlayer, currentGameCost * (10 - playersTricks));
  }
  function checkWhistMointain() {
    if (10 - playersTricks < requiredWhist) {
      updateMountain(
        whistPlayer,
        currentGameCost * (requiredWhist - (10 - playersTricks))
      );
    }
  }
  storePreviousScores();
  if (mizerGame) {
    if (playersTricks > 0) {
      scoreRas = playersTricks * currentGame;
      updateMountain(currentPlayer, scoreRas);
    } else if (playersTricks == 0) {
      updatePool(currentPlayer, currentGame);
    }
    el.gameResult.style.display = "none";
    mizerGame = false;
  } else {
    if (!raspasCount) {
      chekPool();
      checkWhists();
      checkWhistMointain();
    }
    checkMountain();
    el.gameResult.style.display = "none";
  }
  resultsScore();
}

function storePreviousScores() {
  // Create a deep copy of localStorage except for 'previousLocalStorage'
  const currentLocalStorage = { ...localStorage };

  // Remove the previousLocalStorage key from the copy
  delete currentLocalStorage.previousLocalStorage;

  // Store the remaining data in previousLocalStorage as a JSON string
  localStorage.setItem(
    "previousLocalStorage",
    JSON.stringify(currentLocalStorage)
  );
}
function restorePreviousStorage() {
  const storedPreviousScores = localStorage.getItem("previousLocalStorage");

  // Check if there is a previous state stored
  if (storedPreviousScores) {
    // Parse the JSON string back to an object
    const previousLocalStorage = JSON.parse(storedPreviousScores);

    // Restore each key-value pair to localStorage, excluding 'previousLocalStorage'
    for (let key in previousLocalStorage) {
      localStorage.setItem(key, previousLocalStorage[key]);
    }
  }
}

function resultsScore() {
  // read all current data from local storage and save them as variables
  let player1_Mountain = getScore.getCurrentMountainScore(1);
  let player2_Mountain = getScore.getCurrentMountainScore(2);
  let player1_Pool = getScore.getCurrentPoolScore(1);
  let player2_Pool = getScore.getCurrentPoolScore(2);
  let player1_Whist = getScore.getCurrentWhistScore(1);
  let player2_Whist = getScore.getCurrentWhistScore(2);

  // Add Mountain for player with insufficient pool
  if (player1_Pool < aimPool) {
    player1_Mountain = player1_Mountain + (aimPool - player1_Pool) * 2;
    player1_Pool = aimPool;
  }
  if (player2_Pool < aimPool) {
    player2_Mountain = player2_Mountain + (aimPool - player2_Pool) * 2;
    player2_Pool = aimPool;
  }
  // Adjust Mountain and Whist scores
  if (player1_Mountain < player2_Mountain) {
    player2_Mountain -= player1_Mountain;
    player1_Whist += player2_Mountain * 5;
    player1_Mountain = 0;
  } else if (player1_Mountain > player2_Mountain) {
    player1_Mountain -= player2_Mountain;
    player2_Whist += player1_Mountain * 5;
    player2_Mountain = 0;
  } else {
    player1_Mountain = player2_Mountain = 0;
  }

  // Normalize Whist scores
  let midWhist = (player1_Whist + player2_Whist) / 2;
  player1_Whist -= midWhist;
  player2_Whist -= midWhist;

  // Calculate final results for each player
  let resultsPl1 = player1_Whist - player2_Whist;
  let resultsPl2 = player2_Whist - player1_Whist;

  // Toggle dealer and update player names with results
  player1_dealer = !player1_dealer;

  function updatePlayerName(playerId, name, result, isDealer) {
    const dealIcon = isDealer ? deal_image + "  " : "";
    document.getElementById(
      playerId
    ).innerHTML = `${dealIcon}${name} (${result})`;
  }

  // Update the displayed player names and scores
  updatePlayerName("player1_Name", player1_Name, resultsPl1, player1_dealer);
  updatePlayerName("player2_Name", player2_Name, resultsPl2, !player1_dealer);

  localStorage.setItem(`1_Score`, resultsPl1);
  localStorage.setItem(`2_Score`, resultsPl2);
}

function getTheWinner() {
  // Show the winner modal with the announcement
  el.winnerCongrats.style.display = "flex";
  // Retrieve the scores from localStorage
  const player1Score = parseInt(localStorage.getItem("1_Score")) || 0;
  const player2Score = parseInt(localStorage.getItem("2_Score")) || 0;

  // Determine the winner based on the scores
  let winnerAnnouncement = "";
  if (player1Score > player2Score) {
    winnerAnnouncement = `${player1_Name} wins with a score of ${player1Score} against ${player2Score}! 🎉`;
  } else if (player2Score > player1Score) {
    winnerAnnouncement = `${player2_Name} wins with a score of ${player2Score} against ${player1Score}! 🎉`;
  } else {
    winnerAnnouncement = `It's a draw! Both ${player1_Name} and ${player2_Name} have a score of ${player1Score}. 🤝`;
  }

  // Display the winner announcement
  document.getElementById("winnerAnnouncement").textContent =
    winnerAnnouncement;
}
