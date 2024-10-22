// Function to generate buttons based on playerCount
function generatePlayerButtons() {
  let playerCount = localStorage.getItem("playerCount");

  // Array of player names (you can fetch this from localStorage or a config)
  const playerNames = [];
  for (let i = 1; i <= playerCount; i++) {
    playerNames.push(localStorage.getItem(`player${i}_Name`));
    if (i == playerCount) playerNames.push("Raspasovka");
  }

  const modalOptions = document.getElementById("modalOptions");
  modalOptions.innerHTML = ""; // Clear existing buttons

  for (let i = 0; i <= playerCount; i += 2) {
    const row = document.createElement("div");
    row.className = "row";

    // Create button for the first player in the pair
    const button1 = document.createElement("button");
    button1.id = `option${i + 1}`;
    button1.className = "option-button";
    button1.textContent = playerNames[i];
    button1.onclick = () => {
      setActivePlayer(i + 1);
      console.log(`${playerNames[i]} is going to play`);
    };

    row.appendChild(button1); // Add the button to the row

    // Create button for the second player in the pair if it exists
    if (i + 1 <= playerCount) {
      const button2 = document.createElement("button");
      button2.id = `option${i + 2}`;
      button2.className = "option-button";
      button2.textContent = playerNames[i + 1];
      button2.onclick = () => {
        setActivePlayer(i + 2);
        console.log(`${playerNames[i + 1]} is going to play`);
      };
      row.appendChild(button2); // Add the second button to the row
    }

    modalOptions.appendChild(row); // Append the row to modal options
  }
}

window.generatePlayerButtons = generatePlayerButtons;
