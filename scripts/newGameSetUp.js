import gameSet from "./main.js";
import * as getScore from "./getScores.js";

async function handlePlayerCount(count) {
  gameSet.playerCount = count;
  localStorage.setItem("playerCount", gameSet.playerCount);
  console.log("we start to set up the game for:", gameSet.playerCount);
  // fill in names with previous values
  const playenNameField = await waitForElement("playerName1");
  if (playenNameField) {
    document.getElementById("playerName1").value = getScore.getPlayerName(1);
    document.getElementById("playerName2").value = getScore.getPlayerName(2);
    document.getElementById("newGamePoolInput").value = getScore.getGamePool();
  }
  // open the modal with new game settings
  createInputFields(gameSet.playerCount);
}
window.handlePlayerCount = handlePlayerCount;

// Function to create input fields based on variable value, use for new game Player's name set
function createInputFields(count) {
  const inputFieldsContainer = document.getElementById("inputFieldsContainer");
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

function setPlayersNames() {
  document.getElementById("option1").innerText =
    getScore.getPlayerName(1) || "player1";
  gameSet.player1_Name = getScore.getPlayerName(1) || "player1";
  document.getElementById("option2").innerText =
    getScore.getPlayerName(2) || "player2";
  // el.player3_name_option.innerText = getScore.getPlayerName(3) || "player3";
  // el.player4_name_option.innerText = getScore.getPlayerName(4) || "player4";
}
window.setPlayersNames = setPlayersNames;

function setUpNewGame() {
  const savedValue = localStorage.getItem("winnerAnnouncement");
  localStorage.clear();
  if (savedValue !== null) {
    localStorage.setItem("keyToKeep", savedValue);
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
  location.reload();
}
window.setUpNewGame = setUpNewGame;
