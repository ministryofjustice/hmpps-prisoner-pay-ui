import { nodeListForEach } from './utils'
import Card from './card'

function initAll() {
  var $cards = document.querySelectorAll('.card--clickable')
  nodeListForEach($cards, function ($card) {
    new Card($card)
  })
}

export {
  initAll,
  Card,
}
