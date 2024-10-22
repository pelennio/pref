import gameSet from "./main.js";
import * as getScore from "./getScores.js";
import * as common from "./common.js";

//Play ->  the options for the current game is shown
async function setActivePlayer(pl) {
  document.getElementById("modalContainerMain").style.display = "none";
  if (pl == 3) {
    gameSet.currentPlayer = 1;
    gameSet.raspasCount++;
    console.log("We're playing raspasi - count: ", gameSet.raspasCount);
    await loadModal("pages/gameResult_modal.html");
    const newHeader = await waitForElement("resultModalHeader");
    if (newHeader) {
      newHeader.innerText = `How many twicks did ${gameSet.player1_Name} take?`;
    }
  } else {
    gameSet.currentPlayer = pl;
    await loadModal("pages/gameCost_modal.html");
  }
}
window.setActivePlayer = setActivePlayer;

// Function to create wist fields based on variable value
export function createWistFields(count) {
  const wistFieldsContainer = document.getElementById("wistFieldsContainer");
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
// we choose who will wist
// async function handleWistPlayer(player) {
//   let name;
//   if (player == 1) {
//     name = getScore.getPlayerName(1);
//     gameSet.whistPlayer = 1;
//     gameSet.resultHeader = `How many twicks did ${name} take?`;
//     // Instead of calling updateText() immediately, pass the function reference updateText to then(). This ensures that updateText is only called after loadModal() is complete.
//     loadModal("pages/gameResult_modal.html").then(updateText);
//   } else if (player == 2) {
//     name = getScore.getPlayerName(2);
//     gameSet.whistPlayer = 2;
//     loadModal("pages/gameResult_modal.html").then(updateText);
//     gameSet.resultHeader = `How many twicks did ${name} take?`;
//   } else if (player == 0) {
//     gameSet.playersTricks = gameSet.currentGame;
//     gameSet.noWist = true;
//     common.runResultsCalculation();
//     document.getElementById("modalContainerMain").style.display = "none";
//   }
//   document.getElementById("modalContainerMain").style.display = "none";
// }

// We choose who will wist
async function handleWistPlayer(player) {
  let name;
  if (player === 1 || player === 2) {
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
  whoPlays = gameSet.currentPlayer === 1 ? player1_Name : player2_Name;
  gameSet.currentGameCost = contract;
  console.log(gameSet.currentGameCost, "gameSet.currentGameCost");
  document.getElementById("modalContainerMain").style.display = "none";
  const playerCount = localStorage.getItem("playerCount");
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
