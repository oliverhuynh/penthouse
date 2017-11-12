'use strict'

var cssMediaQuery = require('css-mediaquery')

// only filters out:
//  - @print
//  - min-width > width OR min-height > height
// and the latter only if !keepLargerMediaQueries (which is the default)
function _isMatchingMediaQuery (rule, matchConfig) {
  if (rule.type !== 'media') {
    // ignore (keep) all non media query rules
    return true
  }

  let mediaAST
  try {
    mediaAST = cssMediaQuery.parse(rule.media)
  } catch (e) {
    // cant parse, most likely browser cant either
    return false
  }

  var keep = mediaAST.some(function (mq) {
    if (
      (!mq.inverse && mq.type === 'print') ||
      (mq.inverse && mq.type === 'screen')
    ) {
      return false
    }
    // f.e. @media all {}
    // go for false positives over false negatives,
    // i.e. accept @media randomThing {}
    if (mq.expressions.length === 0) {
      return true
    }
    return mq.expressions.some(function (expression) {
      if (expression.modifier === 'min') {
        return cssMediaQuery.match(
          mq.inverse
            ? 'not '
            : '' + '(min-' + expression.feature + ':' + expression.value + ')',
          matchConfig
        )
      } else {
        return true
      }
    })
  })
  return keep
}

function nonMatchingMediaQueryRemover (
  rules,
  width,
  height,
  keepLargerMediaQueries
) {
  var matchConfig = {
    type: 'screen',
    width: (keepLargerMediaQueries ? 9999999999 : width) + 'px',
    height: (keepLargerMediaQueries ? 9999999999 : height) + 'px'
  }
  return rules.filter(function (rule) {
    const isMatching = _isMatchingMediaQuery(rule, matchConfig)
    return isMatching
  })
}

if (typeof module !== 'undefined') {
  module.exports = nonMatchingMediaQueryRemover
}
