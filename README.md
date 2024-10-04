This code implements the logic for a Whist-like game, using localStorage to keep track of player scores, including the pool, mountain, and whist points for two players (Anton and Olena). Here's a breakdown of the key elements:

    Game Initialization:
        When the page loads, it initializes the game settings, retrieves data from localStorage, and updates the player display with scores and dealer information.
        The current pool target (aimPool) is retrieved from localStorage, defaulting to 10 if not set.

    Player and Game Options:
        The UI includes modals where users can select the current player and choose a game type (represented by the number of tricks required).
        Game options determine the cost of the game and how points are distributed (e.g., pool points, whist points, mountain adjustments).

    Handling Game Logic:
        The core game mechanics calculate the player results after each round, adjusting the mountain, pool, and whist scores based on the number of tricks taken by the players.
        Special handling is provided for cases like exceeding the pool target or the "mizer" game, where specific scoring rules apply.

    Modals and UI Interaction:
        Several modals are used for interaction, such as starting a new game, confirming score updates, resetting the game, and showing congratulatory messages when a game ends.
        Event listeners are attached to various buttons, enabling dynamic UI changes based on player actions.

    Score Storage and Restoration:
        The game uses localStorage to store scores, which allows the game to persist across page reloads. A backup mechanism (storePreviousScores and restorePreviousStorage) ensures that scores can be restored if needed.

    Results Calculation:
        The runResultsCalculation function handles the main scoring logic based on the tricks taken, adjusting the mountain, pool, and whist scores accordingly.
        The resultsScore function updates the player names and scores displayed on the UI, toggling the dealer and recalculating the results based on the game's progress.

    Winner Announcement:
        When a player reaches the win condition (such as filling their pool or reaching a certain point threshold), a congratulatory message is displayed, and the game state is saved.
