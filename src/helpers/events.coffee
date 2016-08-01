
events = {}

events.MOUSEDOWN = if 'touchstart' in document.documentElement
  'touchstart'
else
  'mousedown'

module.exports = events
