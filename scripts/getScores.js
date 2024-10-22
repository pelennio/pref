//Load all scores on page load
export function loadDataFromLocalStorage() {
  document.getElementById(`player1_Mountain`).textContent =
    getCurrentMountainString(1) || "...";
  document.getElementById(`player2_Mountain`).textContent =
    getCurrentMountainString(2) || "...";
  document.getElementById(`player1_Pool`).textContent =
    getCurrentPoolString(1) || "...";
  document.getElementById(`player2_Pool`).textContent =
    getCurrentPoolString(2) || "...";
  document.getElementById(`player1_Whist`).textContent =
    getCurrentWhistString(1) || "...";
  document.getElementById(`player2_Whist`).textContent =
    getCurrentWhistString(2) || "...";
}

export function getCurrentMountainScore(player) {
  return localStorage.getItem(`${player}_Mountain_Total`)
    ? Number(localStorage.getItem(`${player}_Mountain_Total`))
    : 0;
}
export function getCurrentMountainString(player) {
  return localStorage.getItem(`${player}_Mountain`);
}

export function getCurrentPoolScore(player) {
  return localStorage.getItem(`${player}_Pool_Total`)
    ? Number(localStorage.getItem(`${player}_Pool_Total`))
    : 0;
}
export function getCurrentPoolString(player) {
  return localStorage.getItem(`${player}_Pool`);
}

export function getGamePool() {
  return localStorage.getItem(`newPool`);
}

export function getCurrentWhistScore(player) {
  return localStorage.getItem(`${player}_Whist_Total`)
    ? Number(localStorage.getItem(`${player}_Whist_Total`))
    : 0;
}
export function getCurrentWhistString(player) {
  return localStorage.getItem(`${player}_Whist`);
}
export function getPlayerName(player) {
  // Try to get the player's name from localStorage. If not found, return a default name like "player_X"
  return localStorage.getItem(`player${player}_Name`) || `player_${player}`;
}
