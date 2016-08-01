
events = {}

events.MOUSEDOWN = if 'ontouchstart' in document.documentElement
  'touchstart'
else
  'mousedown'

module.exports = events
