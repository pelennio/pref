import gameSet from "./main.js";
import * as getScore from "./getScores.js";
import * as common from "./common.js";
import { createWistFields } from "./uiConstructors/wistsButtons.js";

//Play ->  the options for the current game is shown
export async function setActivePlayer(pl) {
  // used for checking the raspasi number
  const raspOption = Number(localStorage.getItem("playerCount")) + 1;
  document.getElementById("modalContainerMain").style.display = "none";
  if (raspOption == pl) {
    gameSet.currentPlayer = 1;
    gameSet.raspasCount++; // add fix to not lost this value on reload
    console.log("We're playing raspasi - count: ", gameSet.raspasCount);
    await loadModal("pages/gameResult_modal.html");
    const newHeader = await waitForElement("resultModalHeader");
    if (newHeader) {
      newHeader.innerText = `How many twicks did ${gameSet.player1_Name} take?`;
    }
  } else {
    gameSet.currentPlayer = pl;
    console.log("You just set the active player to: ", pl);
    await loadModal("pages/gameCost_modal.html");
  }
}
// window.setActivePlayer = setActivePlayer;

// We choose who will wist
export async function handleWistPlayer(player) {
  let name;
  if (player === 1 || player === 2 || player === 3) {
    name = getScore.getPlayerName(player);
    gameSet.whistPlayer = player;
    document.getElementById("modalContainerMain").style.display = "none";
    gameSet.resultHeader = `How many twicks did ${name} take?`;
    loadModal("pages/gameResult_modal.html").then(updateText);
  } else if (player === 0) {
    gameSet.playersTricks = gameSet.currentGame;
    gameSet.noWist = true;
    common.runResultsCalculation();
    document.getElementById("modalContainerMain").style.display = "none";
  }
}

// Update tricks modal header
async function updateText() {
  const resultHeader = await waitForElement("resultModalHeader");
  if (resultHeader) {
    resultHeader.textContent = gameSet.resultHeader;
  } else {
    console.error("Element 'resultModalHeader' not found");
  }
}

// Handle option buttons
async function setBulletPoints(contract) {
  gameSet.raspasCount = 0;
  let whoPlays = ""; // used for the question on UI - who plays
  // Determine the current player

  whoPlays = getScore.getPlayerName(gameSet.currentPlayer);
  // whoPlays = gameSet.currentPlayer === 1 ? player1_Name : player2_Name;
  gameSet.currentGameCost = contract;
  console.log(gameSet.currentGameCost, "gameSet.currentGameCost");
  document.getElementById("modalContainerMain").style.display = "none";
  const playerCount = Number(localStorage.getItem("playerCount"));
  await loadModal("pages/whoWillWist_modal.html");
  createWistFields(playerCount);
}

//Set game cost and required twicks
function handleGameOption(
  bulletPoints,
  gameValue,
  whistValue,
  isMizer = false
) {
  console.log(
    "The game we're going to play: ",
    "\n",
    "Contract: ",
    gameValue,
    "Points: ",
    bulletPoints,
    "Wist player must wist: ",
    whistValue,
    "isMizer: ",
    isMizer
  );
  setBulletPoints(bulletPoints);
  gameSet.currentGame = gameValue;
  gameSet.requiredWhist = whistValue;
  if (isMizer) {
    gameSet.mizerGame = true;
  }
}
window.handleGameOption = handleGameOption;
