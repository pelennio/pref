// Function to create wist fields based on variable value
import gameSet from "../main.js";
import { getPlayerName } from "../getScores.js";
import { handleWistPlayer } from "../newLap.js";

export function createWistFields(count) {
  const wistFieldsContainer = document.getElementById("wistFieldsContainer");
  let wistOption = [0]; // Start with the "Nobody" option
  wistFieldsContainer.innerHTML = ""; // Clear previous fields

  for (let i = 0; i <= count + 1; i++) {
    // Skip the current player if they are the one
    if (i > 0 && gameSet.currentPlayer == i) {
      continue;
    }
    console.log("i: ", i);
    const button = document.createElement("button");
    button.id = `wist${i}`;

    if (i == 0) {
      button.innerText = `Nobody`; // Label for the "Nobody" option
    } else if (i <= count) {
      button.innerText = getPlayerName(i); // Get the player name for other players
      wistOption.push(i); // Add the player index to wistOption array
    } else if (count == 2) {
      continue;
    } else {
      button.innerText = "Both";
      wistOption.push(count + 1);
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
