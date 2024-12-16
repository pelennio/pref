import * as getScore from "./getScores.js";
import gameSet from "./main.js";
import * as undo from "./undoLastRound.js";

let player1_Name = getScore.getPlayerName(1);
let player2_Name = getScore.getPlayerName(2);
let player3_Name = getScore.getPlayerName(3);
let player4_Name = getScore.getPlayerName(4);
const aimPool = Number(localStorage.getItem("newPool")) || 10;
let scoreRas = 0;
let player1_dealer = true;
let leavingWithout3 = false;
let deal_image =
  '<img src="./src/dealer.png" alt="Current dealer" width="30" style="vertical-align: middle;" />';

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
window.handleResultClick = handleResultClick;

// Determine and announce the winner at the end of the game.
function checkTheWinner() {
  const player1Score = parseInt(localStorage.getItem("1_Pool_Total")) || 0;
  const player2Score = parseInt(localStorage.getItem("2_Pool_Total")) || 0;
  if (player1Score == aimPool && player2Score == aimPool) {
    getTheWinner();
  }
}

async function getTheWinner() {
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
  console.log("winnerAnnouncement", winnerAnnouncement);
  storeTheWinner(winnerAnnouncement);

  // Show the winner modal with the announcement
  loadModal("pages/winnerCongrats_modal.html");
  // Display the winner announcement
  const winnerAnnouncementTextField = await waitForElement(
    "winnerAnnouncement"
  );
  if (winnerAnnouncementTextField) {
    document.getElementById("winnerAnnouncement").textContent =
      winnerAnnouncement;
  }
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

function loadDataFromLocalStorage() {
  const playerCount = Number(localStorage.getItem("playerCount")); // Assuming gameSet.playerCount holds the number of players

  // Initialize variables for each player's scores
  let playerScores = {
    player1: {
      Mountain: getScore.getCurrentMountainScore(1) || 0,
      Pool: getScore.getCurrentPoolScore(1) || 0,
      Whist: getScore.getCurrentWhistScore(1) || 0,
    },
    player2: {
      Mountain: getScore.getCurrentMountainScore(2) || 0,
      Pool: getScore.getCurrentPoolScore(2) || 0,
      Whist: getScore.getCurrentWhistScore(2) || 0,
    },
    player3:
      playerCount > 2
        ? {
            // Check if player 3 exists
            Mountain: getScore.getCurrentMountainScore(3) || 0,
            Pool: getScore.getCurrentPoolScore(3) || 0,
            Whist: getScore.getCurrentWhistScore(3) || 0,
          }
        : undefined, // Set to undefined if player 3 doesn't exist
    player4:
      playerCount > 3
        ? {
            // Check if player 4 exists
            Mountain: getScore.getCurrentMountainScore(4) || 0,
            Pool: getScore.getCurrentPoolScore(4) || 0,
            Whist: getScore.getCurrentWhistScore(4) || 0,
          }
        : undefined, // Set to undefined if player 4 doesn't exist
  };
  return playerScores;
}

// count current scores
export function resultsScore() {
  const playerCount = Number(localStorage.getItem("playerCount"));
  const playerScores = loadDataFromLocalStorage();
  let mountains = [];

  // Add Mountain for player with insufficient pool
  if (playerScores.player1.Pool < aimPool) {
    playerScores.player1.Mountain =
      playerScores.player1.Mountain + (aimPool - playerScores.player1.Pool) * 2;
    playerScores.player1.Pool = aimPool;
  }
  if (playerScores.player2.Pool < aimPool) {
    playerScores.player2.Mountain =
      playerScores.player2.Mountain + (aimPool - playerScores.player2.Pool) * 2;
    playerScores.player2.Pool = aimPool;
  }

  for (let i = 1; i <= playerCount; i++) {
    mountains.push(playerScores[`player${i}`].Mountain);
  }
  console.log("mountains", mountains);
  const minMountainScore = Math.min(...mountains);
  console.log("minMountainScore", minMountainScore);

  // adjust all mountins regardin to min value
  for (let i = 1; i <= playerCount; i++) {
    playerScores[`player${i}`].Mountain -= minMountainScore;
    console.log("mountains", playerScores[`player${i}`].Mountain);
  }
  // Adjust Mountain and Whist scores
  // if (playerScores.player1.Mountain < playerScores.player2.Mountain) {
  //   playerScores.player2.Mountain -= playerScores.player1.Mountain;
  //   playerScores.player1.Whist += playerScores.player2.Mountain * 5;
  //   playerScores.player1.Mountain = 0;
  // } else if (playerScores.player1.Mountain > playerScores.player2.Mountain) {
  //   playerScores.player1.Mountain -= playerScores.player2.Mountain;
  //   playerScores.player2.Whist += playerScores.player1.Mountain * 5;
  //   playerScores.player2.Mountain = 0;
  // } else {
  //   playerScores.player1.Mountain = playerScores.player2.Mountain = 0;
  // }
  playerScores.player1.Whist += playerScores.player2.Mountain * 5;
  playerScores.player2.Whist += playerScores.player1.Mountain * 5;
  playerScores.player1.Mountain = playerScores.player2.Mountain = 0;
  // Normalize Whist scores
  let midWhist = (playerScores.player1.Whist + playerScores.player2.Whist) / 2;
  playerScores.player1.Whist -= midWhist;
  playerScores.player2.Whist -= midWhist;

  // Calculate final results for each player
  let resultsPl1 = playerScores.player1.Whist - playerScores.player2.Whist;
  let resultsPl2 = playerScores.player2.Whist - playerScores.player1.Whist;

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

// Central function to handle the scoring logic after a round of tricks has been played.
export function runResultsCalculation() {
  let remainingTricks = 10 - gameSet.playersTricks;

  function checkPool() {
    // If player wins the required number of tricks, update the pool
    if (gameSet.playersTricks >= gameSet.currentGame) {
      updatePool(gameSet.currentPlayer, gameSet.currentGameCost);
    }
    // there is no else option as if player does not take required twicks he doesn't gett a pool
  }

  function checkMountain() {
    if (!gameSet.raspasCount) {
      if (gameSet.playersTricks < gameSet.currentGame) {
        // Player didn't win enough tricks, so they get mountain points
        console.log(
          "Mount should be added for ",
          gameSet.currentGame - gameSet.playersTricks,
          "tricks"
        );
        updateMountain(
          gameSet.currentPlayer,
          gameSet.currentGameCost *
            (gameSet.currentGame - gameSet.playersTricks)
        );
      }
    } // options if we play raspasi
    else {
      gameSet.currentPlayer = 1;
      let remainingTricks1 = gameSet.playersTricks,
        playersTricks1 = remainingTricks;
      remainingTricks = remainingTricks1;
      gameSet.playersTricks = playersTricks1;
      // Raspas logic: adjusting mountain points based on players' tricks
      if (gameSet.playersTricks < remainingTricks) {
        scoreRas =
          (remainingTricks - gameSet.playersTricks) * gameSet.raspasCount;
        gameSet.currentPlayer = 2;
      } else if (gameSet.playersTricks > remainingTricks) {
        scoreRas =
          (gameSet.playersTricks - remainingTricks) * gameSet.raspasCount;
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
          gameSet.currentGameCost *
            (remainingTricks + (gameSet.currentGame - gameSet.playersTricks))
        );
      } else
        updateWhist(
          gameSet.whistPlayer,
          gameSet.currentGameCost * (10 - gameSet.playersTricks)
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
    if (gameSet.remainingTricks < gameSet.requiredWhist) {
      updateMountain(
        gameSet.whistPlayer,
        gameSet.currentGameCost * (gameSet.requiredWhist - remainingTricks)
      );
    }
  }

  undo.storePreviousScores();

  if (gameSet.mizerGame) {
    if (gameSet.playersTricks > 0) {
      scoreRas = gameSet.playersTricks * gameSet.currentGame;
      updateMountain(gameSet.currentPlayer, scoreRas);
    } else if (gameSet.playersTricks == 0) {
      updatePool(gameSet.currentPlayer, gameSet.currentGame);
    }
    closeModal();
    // el.gameResult_modal.style.display = "none";
    gameSet.mizerGame = false;
  } else {
    if (!gameSet.raspasCount) {
      checkPool();
      checkWhists();
      checkWhistMointain();
    }
    checkMountain();
    // el.gameResult_modal.style.display = "none";
    document.getElementById("modalContainerMain").style.display = "none";
  }
  resultsScore();
  checkTheWinner();
}
