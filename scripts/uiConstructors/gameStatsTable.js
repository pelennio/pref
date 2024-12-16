export function createTable(playerCount) {
  // Create table elements
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const playerNames = [];
  for (let i = 1; i <= playerCount; i++) {
    playerNames.push(localStorage.getItem(`player${i}_Name`));
  }

  // Create header row
  const headerRow = document.createElement("tr");
  playerNames.slice(0, playerCount).forEach((name, index) => {
    const th = document.createElement("th");
    th.id = `player${index + 1}_Name`;
    th.style.width = `${100 / playerCount}%`; // Adjust width based on player count
    th.textContent = name;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create data rows
  const categories = ["Mountain", "Pool", "Whist"];
  categories.forEach((category) => {
    const row = document.createElement("tr");
    for (let i = 0; i < playerCount; i++) {
      const td = document.createElement("td");
      td.id = `player${i + 1}_${category}`;
      td.textContent = category; // You can replace this with dynamic values if needed
      row.appendChild(td);
    }
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Append the table to the container
  document.getElementById("tableContainer").appendChild(table);
}
