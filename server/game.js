const { v4 } = require("uuid")

const CARD_TYPES = ["ambassador", "assassin", "duke", "captain", "contessa"]

class Player {
  cards = []
  money = 2
  token = "Unkown"

  constructor(game, token) {
    this.lost = false
    this.game = game
    this.token = token
  }

  toJSON() {
    return {
      token: this.token,
      cards: this.cards.map(card => ({
        isLost: card.lost,
        type: card.lost ? card.type : "CARD",
      })),
      money: this.money,
    }
  }

  gameOver() {
    return this.lost
  }

  adjustMoney(amount) {
    this.money = this.money + amount
  }

  loseInfluence(card_token) {
    this.cards.forEach(card => {
      if (card.token === card_token) {
        card.lost = true
      }
    })
  }
}

const Card = type => ({
  token: v4(),
  type: type,
  lost: false,
})

class Game {
  constructor(token) {
    this.token = token
    this.players = []
    this.cards = []
    this.reset()
  }

  join(player) {
    this.players = [...this.players, player]
    console.debug(`${player.token} is joining`)
  }

  reset() {
    this.cards = CARD_TYPES.map(card => [
      Card(card),
      Card(card),
      Card(card),
    ]).flat()
  }

  drawCard() {
    this.shuffle()
    return this.cards.pop()
  }

  returnCard(card_token) {
    this.cards.push(card_token)
  }

  shuffle() {
    const array = this.cards
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  getGameInfo(playerId) {
    return this.players
      .filter(player => player.token !== playerId)
      .map(player => player.toJSON())
  }
}

module.exports = {
  Game,
  Player,
  Card,
}
