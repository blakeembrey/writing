var highlight = require('highlight.js');

/**
 * Support github flavoured markdown with syntax highlighting.
 *
 * @type {Object}
 */
module.exports = {
  gfm: true,
  tables: true,
  highlight: function (code, lang) {
    if (!lang) {
      return code;
    }

    try {
      return highlight.highlight(lang, code).value;
    } catch (e) {
      return code;
    }
  }
};
