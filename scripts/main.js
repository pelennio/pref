import * as getScore from "./getScores.js";
import { el } from "./components.js";
import * as helpers from "./common.js";

let gameSet = {
  currentPlayer: 1,
  whistPlayer: 2,
  raspasCount: 0,
  newPool: 10,
  playerCount: 0,
  currentGame: 0,
  playersTricks: 0,
  noWist: false,
  player1_Name: "",
};
export default gameSet;

// Load data from localStorage after the page is loaded
window.addEventListener("load", function () {
  document.getElementById("poolText").textContent =
    localStorage.getItem("newPool") || 10;
  getScore.loadDataFromLocalStorage();
  helpers.resultsScore(); // add score for each player next to the name
});

// When the user clicks the button "PLAY", open the modal with option to choose the player
el.playNewGame.onclick = () => {
  el.player1_name_option.innerText = getScore.getPlayerName(1) || "player1";
  gameSet.player1_Name = getScore.getPlayerName(1) || "player1";
  el.player2_name_option.innerText = getScore.getPlayerName(2) || "player2";
  // el.player3_name_option.innerText = getScore.getPlayerName(3) || "player3";
  // el.player4_name_option.innerText = getScore.getPlayerName(4) || "player4";
  el.whoPlays_modal.style.display = "flex";
};

// CLOSE MODALS
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
  if (event.target.classList.contains("close")) {
    const modalId = event.target.getAttribute("data-modal");
    document.getElementById(modalId).style.display = "none";
  }
  if (event.target.classList.contains("cancel")) {
    const modalId = event.target.getAttribute("data-modal");
    document.getElementById(modalId).style.display = "none";
  }
});

el.cancelReset.onclick = function () {
  el.resetConfirmation_modal.style.display = "none"; // open the modal with game types
};

// Open window for setting new game, it proose to confirm it
document.getElementById("localReset").onclick = function () {
  el.resetConfirmation_modal.style.display = "flex";
};
//After confirmation we open the window with options how many players will be playing
document.getElementById("confirm").onclick = function () {
  el.resetConfirmation_modal.style.display = "none"; // close modal confirmation
  el.playerCount_modal.style.display = "flex";
};

function handlePlayerCount(count) {
  el.playerCount_modal.style.display = "none";
  el.newGamePool_modal.style.display = "flex";

  // fill in names with previous values
  document.getElementById("playerName1").value = getScore.getPlayerName(1);
  document.getElementById("playerName2").value = getScore.getPlayerName(2);

  // open the modal with new game settings
  gameSet.playerCount = count;
  localStorage.setItem("playerCount", gameSet.playerCount);
  console.log(gameSet.playerCount);
  createInputFields(gameSet.playerCount);
}

document.getElementById("count2").onclick = () => handlePlayerCount(2);
document.getElementById("count3").onclick = () => handlePlayerCount(3);
document.getElementById("count4").onclick = () => handlePlayerCount(4);

el.undoBtn.onclick = function () {
  helpers.restorePreviousStorage();
  location.reload();
};

el.confirmNewGame.onclick = function () {
  el.newGamePool_modal.style.display = "none";
  const savedValue = localStorage.getItem(winnerAnnouncement);
  localStorage.clear();
  if (savedValue !== null) {
    localStorage.setItem(keyToKeep, savedValue);
  }
  gameSet.newPool = document.getElementById("newGamePoolInput").value;
  localStorage.setItem("newPool", gameSet.newPool);
  localStorage.setItem("playerCount", gameSet.playerCount);
  // Player 1
  let player1_Name = document.getElementById("playerName1").value;
  localStorage.setItem("player1_Name", player1_Name);

  // Player 2
  let player2_Name = document.getElementById("playerName2").value;
  localStorage.setItem("player2_Name", player2_Name);

  // Player 3
  let player3Element = document.getElementById("playerName3");
  // Check if the element exists
  let player3_Name = player3Element ? player3Element.value : "name";
  localStorage.setItem("player3_Name", player3_Name);

  // Player 4
  let player4Element = document.getElementById("playerName4");
  // Check if the element exists
  let player4_Name = player4Element ? player4Element.value : "name";
  localStorage.setItem("player4_Name", player4_Name);

  document.getElementById("poolText").textContent =
    localStorage.getItem("newPool");
  document.getElementById("newGamePoolInput").value = 10;
  location.reload();
};

el.setNewGameFromWinnerModal.onclick = function () {
  el.winnerCongrats_modal.style.display = "none";
  el.newGamePool_modal.style.display = "flex";
};

//Play ->  the options for the current game is shown
document.getElementById("option1").onclick = function () {
  el.gameCost_modal.style.display = "flex"; // open the modal with game types
  el.whoPlays_modal.style.display = "none"; // Close modal after selection
  gameSet.currentPlayer = 1;
  //   gameSet.whistPlayer = 2;
};

document.getElementById("option2").onclick = function () {
  el.gameCost_modal.style.display = "flex";
  el.whoPlays_modal.style.display = "none"; // Close modal after selection
  gameSet.currentPlayer = 2;
  //   gameSet.whistPlayer = 1;
  gameSet.raspasCount = 0;
};
// Raspasovka option
document.getElementById("option3").onclick = function () {
  el.resultHeader.innerText = `How many twicks did ${gameSet.player1_Name} take?`;
  el.whoPlays_modal.style.display = "none";
  el.gameResult_modal.style.display = "flex";
  gameSet.currentPlayer = 1;
  gameSet.raspasCount++;
  console.log("We're playing raspasi - count: ", gameSet.raspasCount);
};

// Attach the click event to all game options
el.gameOption1.onclick = () => helpers.handleGameOption(2, 6, 4);
el.gameOption2.onclick = () => helpers.handleGameOption(4, 7, 2);
el.gameOption3.onclick = () => helpers.handleGameOption(6, 8, 1);
el.gameOption4.onclick = () => helpers.handleGameOption(8, 9, 0);
el.gameOption5.onclick = () => helpers.handleGameOption(10, 10, 0);
el.gameOption6.onclick = () => helpers.handleGameOption(10, 10, 0, true);

// Attach event listeners to all result options
for (let i = 0; i <= 11; i++) {
  document.getElementById(`results-option${i}`).onclick = () =>
    helpers.handleResultClick(i);
}
const inputFieldsContainer = document.getElementById("inputFieldsContainer");
// Function to create input fields based on variable value
function createInputFields(count) {
  inputFieldsContainer.innerHTML = ""; // Clear previous fields
  for (let i = 2; i < count; i++) {
    const input = document.createElement("input");
    input.id = `playerName${i + 1}`;
    input.type = "text";
    input.placeholder = `Enter Player ${i + 1} Name`;
    input.className = "input-field";
    inputFieldsContainer.appendChild(input);
    input.value = getScore.getPlayerName(i + 1);
  }
}

// Helper for the modal with chosing of wist player
const wistFieldsContainer = document.getElementById("wistFieldsContainer");

// Function to create wist fields based on variable value
export function createWistFields(count) {
  let wistOption = [0]; // Start with the "Nobody" option

  wistFieldsContainer.innerHTML = ""; // Clear previous fields

  for (let i = 0; i <= count; i++) {
    // Skip the current player if they are the one
    if (i > 0 && gameSet.currentPlayer == i) {
      continue;
    }

    const button = document.createElement("button");
    button.id = `wist${i}`;

    if (i == 0) {
      button.innerText = `Nobody`; // Label for the "Nobody" option
    } else {
      button.innerText = getScore.getPlayerName(i); // Get the player name for other players
      wistOption.push(i); // Add the player index to wistOption array
    }

    button.className = "option-button";
    wistFieldsContainer.appendChild(button); // Append the button to the container
  }

  // Add click event listeners for each wist option
  wistOption.forEach((option) => {
    document.getElementById(`wist${option}`).onclick = () =>
      handleWistPlayer(option);
  });
}

function handleWistPlayer(player) {
  //costil
  let name;
  if (player == 1) {
    name = getScore.getPlayerName(1);
    gameSet.whistPlayer = 1;
    el.gameResult_modal.style.display = "flex";
  } else if (player == 2) {
    name = getScore.getPlayerName(2);
    gameSet.whistPlayer = 2;
    el.gameResult_modal.style.display = "flex";
  } else if (player == 0) {
    gameSet.playersTricks = gameSet.currentGame;
    gameSet.noWist = true;
    helpers.runResultsCalculation();

    // name = getScore.getPlayerName(2);
    // gameSet.whistPlayer = 2;
  }
  el.resultHeader.innerText = `How many twicks did ${name} take?`;

  el.whoWillWist_modal.style.display = "none";
}
