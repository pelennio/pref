import * as getScore from "./getScores.js";
import { el } from "./components.js";
import * as helpers from "./common.js";

let gameSet = {
  currentPlayer: 1,
  whistPlayer: 2,
  raspasCount: 0,
  newPool: 10,
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
  el.player1_name_option.innerText = getScore.getPlayerName(1);
  el.player2_name_option.innerText = getScore.getPlayerName(2);
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

//When user sets the player -> the options for the current game is shown
document.getElementById("option1").onclick = function () {
  el.gameCost_modal.style.display = "flex"; // open the modal with game types
  el.whoPlays_modal.style.display = "none"; // Close modal after selection
  gameSet.currentPlayer = 1;
  gameSet.whistPlayer = 2;
};

document.getElementById("localReset").onclick = function () {
  el.resetConfirmation_modal.style.display = "flex";
};

document.getElementById("confirm").onclick = function () {
  el.resetConfirmation_modal.style.display = "none"; // close modal confirmation
  el.newGamePool_modal.style.display = "flex"; // open the modal with new game settings
};

el.cancelReset.onclick = function () {
  el.resetConfirmation_modal.style.display = "none"; // open the modal with game types
};

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
  player1_Name = document.getElementById("playerName1").value;
  localStorage.setItem("player1_Name", player1_Name);
  player2_Name = document.getElementById("playerName2").value;
  localStorage.setItem("player2_Name", player2_Name);
  document.getElementById("poolText").textContent =
    localStorage.getItem("newPool");
  document.getElementById("newGamePoolInput").value = 10;
  location.reload();
};

el.setNewGameFromWinnerModal.onclick = function () {
  el.winnerCongrats_modal.style.display = "none";
  el.newGamePool_modal.style.display = "flex";
};

document.getElementById("option2").onclick = function () {
  el.gameCost_modal.style.display = "flex";
  el.whoPlays_modal.style.display = "none"; // Close modal after selection
  gameSet.currentPlayer = 2;
  gameSet.whistPlayer = 1;
  gameSet.raspasCount = 0;
};
// Raspasovka option
document.getElementById("option3").onclick = function () {
  el.resultHeader.innerText = `How many twicks did ${player1_Name} take?`;
  el.whoPlays_modal.style.display = "none";
  el.gameResult_modal.style.display = "flex";
  gameSet.currentPlayer = 1;
  gameSet.raspasCount++;
  console.log(gameSet.raspasCount);
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
