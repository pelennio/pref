import * as getScore from "./getScores.js";

import * as calculations from "./common.js";
import * as constructor from "./gameTableConstructor.js";

var gameSet = {
  currentPlayer: 1,
  whistPlayer: 2,
  raspasCount: 0,
  newPool: 10,
  playerCount: 0,
  currentGame: 0,
  playersTricks: 0,
  noWist: false,
  player1_Name: "",
  resultHeader: "",
  requiredWhist: 0,
  currentGameCost: 0,
  mizerGame: false,
  player1_dealer: 1,
};
export default gameSet;

// Load data from localStorage after the page is loaded
window.addEventListener("load", function () {
  let count = localStorage.getItem("playerCount");
  constructor.createTable(count);
  gameSet.player1_Name = getScore.getPlayerName(1);
  document.getElementById("poolText").textContent =
    localStorage.getItem("newPool") || 10;
  getScore.loadDataFromLocalStorage();
  calculations.resultsScore(); // add score for each player next to the nmain.js:107:56ame
});
