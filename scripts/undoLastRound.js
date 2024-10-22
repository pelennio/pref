// new one
import gameSet from "./main.js";

export function storePreviousScores123() {
  try {
    // Create a copy of localStorage, excluding 'previousLocalStorage'
    const currentLocalStorage = {};
    for (let key in localStorage) {
      if (key !== "previousLocalStorage") {
        currentLocalStorage[key] = localStorage.getItem(key);
      }
    }

    // Store the remaining data in 'previousLocalStorage' as a JSON string
    localStorage.setItem(
      "previousLocalStorage",
      JSON.stringify(currentLocalStorage)
    );
  } catch (error) {
    console.error("Error storing previous scores:", error);
  }
}

// new one

export function storePreviousScores() {
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
  const keysToKeep = [
    "player1_Name",
    "player2_Name",
    "player3_Name",
    "player4_Name",
    "playerCount",
    "newPool",
    "winnerAnnouncement",
  ];

  // Clear local storage except for the specified keys
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  }

  // Restore previous state if it exists
  if (!storedPreviousScores) {
    console.log("No previous local storage found.");
    return; // Early exit if no previous storage
  }

  const previousLocalStorage = JSON.parse(storedPreviousScores);

  // Restore each key-value pair to localStorage, excluding 'previousLocalStorage'
  Object.entries(previousLocalStorage).forEach(([key, value]) => {
    if (key !== "previousLocalStorage") {
      localStorage.setItem(key, value);
    }
  });

  // Toggle dealer between player 1 and player 2
  gameSet.player1_dealer = !gameSet.player1_dealer;

  // Reload the page to reflect the changes
  location.reload();
}

window.restorePreviousStorage = restorePreviousStorage;
