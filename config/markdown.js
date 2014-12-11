var hljs = require('highlight.js');

/**
 * Support github flavoured markdown with syntax highlighting.
 *
 * @type {Object}
 */
module.exports = {
  gfm: true,
  tables: true,
  highlight: function (code, lang) {
    var isDiff = /\.diff$/i.test(lang);

    lang = isDiff ? lang.slice(0, -5) : lang;

    if (lang) {
      code = highlight(code, lang);
    }

    return isDiff ? diff(code) : code;
  }
};

/**
 * Attempt to highlight code.
 *
 * @param  {String} code
 * @param  {String} lang
 * @return {String}
 */
function highlight (code, lang) {
  try {
    return hljs.highlight(lang, code).value;
  } catch (e) {
    return code;
  }
}

/**
 * Add diff syntax highlighting to code.
 *
 * @param  {String} code
 * @return {String}
 */
function diff (code) {
  return code
    .split('\n')
    .map(function (line) {
      if (/^@@ [^@]+ @@$/.test(line)) {
        return '<span class="line-metadata">' + line + '</span>';
      }

      if (line[0] === '+') {
        return '<span class="line-added">' + line.substr(1) + '</span>';
      }

      if (line[0] === '-') {
        return '<span class="line-removed">' + line.substr(1) + '</span>';
      }

      if (line[0] === ' ') {
        return line.substr(1);
      }

      return line;
    })
    .join('\n');
}
