const express = require("express")
const app = express()
const port = 3000
const path = require("path")

// Application
const { v4 } = require("uuid")
const { Game, Player, Card } = require("./game")
const games = {}

app.get("/", (req, res) => res.json("Hello World!"))

// USER
app.post("/user", function (req, res) {
  res.json("Got a POST at /user")
})

app.put("/user/:id", function (req, res) {
  res.json("Got a POST at /user")
})

// GAME
app.post("/game/:gid", function (req, res) {
  games[req.params.gid] = {
    game: new Game(req.params.gid),
    players: {},
  }

  res.json({
    token: req.params.gid,
    players: games[req.params.gid].game.getGameInfo(),
    deck: games[req.params.gid].game.cards.length,
  })
})

app.get("/games", function (req, res) {
  res.json(games)
})

app.post("/game/:gid/:player", function (req, res) {
  const gameId = req.params.gid
  const playerId = req.params.player
  if (!games.hasOwnProperty(gameId)) {
    res.status(404).json({ error: "Game not found" })
  } else if (games[gameId].players.hasOwnProperty(playerId)) {
    res.status(400).json({ error: "This username is taken" })
  } else {
    const thisPlayer = new Player(gameId, playerId)
    games[gameId].game.join(thisPlayer)
    games[gameId].players[playerId] = thisPlayer
    console.debug(thisPlayer, thisPlayer.cards)
    thisPlayer.cards.push(games[gameId].game.drawCard())
    thisPlayer.cards.push(games[gameId].game.drawCard())
    res.json({
      player: {
        cards: thisPlayer.cards,
        money: thisPlayer.money,
      },
      game: {
        players: games[gameId].game.getGameInfo(playerId),
      },
    })
  }
})

app.put("/game/:gid/:player/money/:diff", function (req, res) {
  const gameId = req.params.gid
  const playerId = req.params.player
  const money = req.params.diff
  if (!games.hasOwnProperty(gameId)) {
    res.status(404).json({ error: "Game not found" })
  } else if (!games[gameId].players.hasOwnProperty(playerId)) {
    res.status(404).json({ error: "Username not found" })
  } else {
    const thisPlayer = games[gameId].players[playerId]
    console.debug(thisPlayer, thisPlayer.money)
    thisPlayer.adjustMoney(Number.parseInt(money))
    res.json({
      player: {
        cards: thisPlayer.cards,
        money: thisPlayer.money,
      },
      game: {
        players: games[gameId].game.getGameInfo(playerId),
      },
    })
  }
})

/**
 * 
# Reset the game
post '/games/:game_id/players/:player_id/reset' do
  game = GAMES[params[:game_id]]
  player = game.players[params[:player_id]]
  game.reset!
  game_for(game, player).to_json
end

# Draw a card
post '/games/:game_id/players/:player_id/draw' do
  game = GAMES[params[:game_id]]
  player = game.players[params[:player_id]]
  params[:cards].to_i.times.each { game.draw_for(player) }
  game_for(game, player).to_json
end

# Return a card
post '/games/:game_id/players/:player_id/return/:card_token' do
  game = GAMES[params[:game_id]]
  player = game.players[params[:player_id]]
  game.return_from(player, params[:card_token])
  game_for(game, player).to_json
end

# Refresh game
get '/games/:game_id/players/:player_id' do
  game = GAMES[params[:game_id]]
  player = game.players[params[:player_id]]
  game_for(game, player).to_json
end

# Adjust money
post '/games/:game_id/players/:player_id/adjust_money/:amount' do
  game = GAMES[params[:game_id]]
  player = game.players[params[:player_id]]
  player.adjust_money(params[:amount].to_i)
  game_for(game, player).to_json
end

# Lose influence
post '/games/:game_id/players/:player_id/lose/:card_token' do
  game = GAMES[params[:game_id]]
  player = game.players[params[:player_id]]
  player.lose_influence(params[:card_token])
  game_for(game, player).to_json
end
 */

app.use("/static", express.static(path.join(__dirname, "public")))

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)
