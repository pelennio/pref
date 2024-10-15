import * as getScore from "./getScores.js";
import { el } from "./components.js";
import gameSet, { createWistFields } from "./main.js";

let player1_Name = getScore.getPlayerName(1);
let player2_Name = getScore.getPlayerName(2);
let player3_Name = getScore.getPlayerName(3);
let player4_Name = getScore.getPlayerName(4);
const aimPool = localStorage.getItem("newPool") || 10;
// let playersTricks = 0;
// let currentGame = 0;
let currentGameCost = 0;
let requiredWhist = 0;
let raspasCount = 0;
let scoreRas = 0;
let mizerGame = false;
let player1_dealer = true;
let leavingWithout3 = false;
let deal_image =
  '<img src="./src/1804142.png" alt="Current dealer" width="30" style="vertical-align: middle;" />';

//set game cost and required twicks
export function handleGameOption(
  bulletPoints,
  gameValue,
  whistValue,
  isMizer = false
) {
  setBulletPoints(bulletPoints);
  gameSet.currentGame = gameValue;
  requiredWhist = whistValue;
  if (isMizer) {
    mizerGame = true;
  }
}

// Updates the mountain score if the player doesn't meet the required tricks.
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

// Updates the player's pool based on whether they have met their game requirement.
function updatePool(player, score) {
  // Get current pool score for the player
  let currentScore = getScore.getCurrentPoolScore(player);

  // Case 1: Score exceeds the aimPool
  if (currentScore + score > aimPool) {
    // When the score exceeds the aimPool limit, adjust to match the aimPool
    //case not covered when there is no mounting to be adjusted
    let adjustedScore = aimPool - currentScore;
    updatePoolScore(player, adjustedScore);

    let whistPlayerPoolDeficit =
      aimPool - getScore.getCurrentPoolScore(gameSet.whistPlayer);
    let remainingScore = score - adjustedScore;

    if (remainingScore < whistPlayerPoolDeficit) {
      // Update Whist score and the whistPlayer's pool
      updateWhist(player, remainingScore * 10);
      updatePoolScore(gameSet.whistPlayer, remainingScore);
    } else {
      // Update whistPlayer's Whist score and handle overflow to Mountain
      updateWhist(player, whistPlayerPoolDeficit * 10);
      updatePool(gameSet.whistPlayer, whistPlayerPoolDeficit);
      updateMountain(player, -(remainingScore - whistPlayerPoolDeficit));
    }
  }
  // Case 2: Score exactly meets aimPool
  else if (currentScore + score == aimPool) {
    // If score does not exceed aimPool, simply update the pool score
    updatePoolScore(player, score);
    if (getScore.getCurrentPoolScore(gameSet.whistPlayer) == aimPool) {
    }
  }
  // Case 3: Score does not exceed aimPool
  else {
    updatePoolScore(player, score);
  }

  // Helper function to update the player's pool score
  function updatePoolScore(player, score) {
    let currentScore = getScore.getCurrentPoolScore(player);
    let currentScoreString = getScore.getCurrentPoolString(player);
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

// Updates the Whist score for the player who met their tricks.
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
export function handleResultClick(tricks) {
  if (tricks == 11) {
    gameSet.playersTricks = gameSet.currentGame - 3;
    console.log(gameSet.playersTricks);
    leavingWithout3 = true;
  } else {
    gameSet.playersTricks = 10 - tricks;
  }
  runResultsCalculation();
}

// new one

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
export function restorePreviousStorage() {
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
  player1_dealer = !player1_dealer;
}
// Determine and announce the winner at the end of the game.
function checkTheWinner() {
  const player1Score = parseInt(localStorage.getItem("1_Pool_Total")) || 0;
  const player2Score = parseInt(localStorage.getItem("2_Pool_Total")) || 0;
  if (player1Score == aimPool && player2Score == aimPool) {
    getTheWinner();
  }
}

function getTheWinner() {
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
  storeTheWinner(winnerAnnouncement);

  // Display the winner announcement
  document.getElementById("winnerAnnouncement").textContent =
    winnerAnnouncement;
  // Show the winner modal with the announcement
  el.winnerCongrats_modal.style.display = "flex";
}

function storeTheWinner(winnerAnnouncement) {
  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Create a new entry with message and date
  const winnerData = {
    message: winnerAnnouncement,
    date: currentDate,
  };

  // Retrieve existing data
  let storedAnnouncements =
    JSON.parse(localStorage.getItem("winnerAnnouncement")) || [];
  // Add the new entry to the existing data
  storedAnnouncements.push(winnerData);

  // store updated array
  localStorage.setItem(
    "winnerAnnouncement",
    JSON.stringify(storedAnnouncements)
  );
}

// count current scores
export function resultsScore() {
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

// Handle option buttons
function setBulletPoints(contract) {
  gameSet.raspasCount = 0;
  let whoPlays = ""; // used for the question on UI - who plays
  // Determine the current player
  whoPlays = gameSet.currentPlayer === 1 ? player1_Name : player2_Name;
  el.resultHeader.innerText = `How many twicks did ${whoPlays} take?`;
  currentGameCost = contract;
  el.gameCost_modal.style.display = "none";

  el.whoWillWist_modal.style.display = "flex";
  const playerCount = localStorage.getItem("playerCount");
  createWistFields(playerCount);
  // el.gameResult_modal.style.display = "flex";
  console.log("Current game cost: ", currentGameCost);
}

// Central function to handle the scoring logic after a round of tricks has been played.
export function runResultsCalculation() {
  const remainingTricks = 10 - gameSet.playersTricks;

  function checkPool() {
    // If player wins the required number of tricks, update the pool
    if (gameSet.playersTricks >= gameSet.currentGame) {
      updatePool(gameSet.currentPlayer, currentGameCost);
    }
    // there is no else option as if player does not take required twicks he doesn't gett a pool
  }

  function checkMountain() {
    if (!raspasCount) {
      if (gameSet.playersTricks < gameSet.currentGame) {
        // Player didn't win enough tricks, so they get mountain points
        console.log(
          "Mount should be added for ",
          gameSet.currentGame - gameSet.playersTricks,
          "tricks"
        );
        updateMountain(
          gameSet.currentPlayer,
          currentGameCost * (gameSet.currentGame - gameSet.playersTricks)
        );
      }
    } // options if we play raspasi
    else {
      // Raspas logic: adjusting mountain points based on players' tricks
      if (gameSet.playersTricks < remainingTricks) {
        scoreRas = (remainingTricks - gameSet.playersTricks) * raspasCount;
        gameSet.currentPlayer = 2;
      } else if (gameSet.playersTricks > remainingTricks) {
        scoreRas = (gameSet.playersTricks - remainingTricks) * raspasCount;
      } else if (gameSet.playersTricks == remainingTricks) {
        scoreRas = 0;
      }
      updateMountain(gameSet.currentPlayer, scoreRas);
    }
  }
  function checkWhists() {
    if (!leavingWithout3 && !gameSet.noWist) {
      if (gameSet.playersTricks <= gameSet.currentGame) {
        updateWhist(
          gameSet.whistPlayer,
          currentGameCost *
            (remainingTricks + (gameSet.currentGame - gameSet.playersTricks))
        );
      } else
        updateWhist(
          gameSet.whistPlayer,
          currentGameCost * (10 - gameSet.playersTricks)
        );
    } else if (leavingWithout3) {
      leavingWithout3 = false;
      return;
    } else if (gameSet.noWist) {
      gameSet.noWist = false;
      return;
    }
  }

  function checkWhistMointain() {
    if (remainingTricks < requiredWhist) {
      updateMountain(
        gameSet.whistPlayer,
        currentGameCost * (requiredWhist - remainingTricks)
      );
    }
  }

  storePreviousScores();

  if (mizerGame) {
    if (gameSet.playersTricks > 0) {
      scoreRas = gameSet.playersTricks * gameSet.currentGame;
      updateMountain(gameSet.currentPlayer, scoreRas);
    } else if (gameSet.playersTricks == 0) {
      updatePool(gameSet.currentPlayer, gameSet.currentGame);
    }
    el.gameResult_modal.style.display = "none";
    mizerGame = false;
  } else {
    if (!raspasCount) {
      checkPool();
      checkWhists();
      checkWhistMointain();
    }
    checkMountain();
    el.gameResult_modal.style.display = "none";
  }
  resultsScore();
  checkTheWinner();
}
