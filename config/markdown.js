var highlighter = require('highlighter');

/**
 * Support github flavoured markdown with syntax highlighting.
 *
 * @type {Object}
 */
module.exports = {
  gfm: true,
  tables: true,
  highlight: highlighter()
};
