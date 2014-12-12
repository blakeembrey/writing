var hljs = require('highlight.js');

var SEPARATOR = '\n';

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

    return isDiff ? diff(code, lang) : highlight(code, lang);
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
  if (!lang) {
    return code;
  }

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
 * @param  {String} lang
 * @return {String}
 */
function diff (code, lang) {
  var sections  = [];

  code.split(/\r?\n/g).forEach(function (line) {
    var type = null;

    if (/^@@ [^@]+ @@$/.test(line)) {
      type = 'chunk';
    } else if (/^[+\-]/.test(line)) {
      type = line[0] === '+' ? 'addition' : 'deletion';
      line = line.substr(1);
    } else {
      line = line.replace(/^ /, '');
    }

    // Merge data with the previous section where possible.
    var previous = sections[sections.length - 1];

    if (!previous || previous.type !== type) {
      sections.push({
        type: type,
        lines: [line]
      });

      return;
    }

    previous.lines.push(line);
  });

  var additions = extractHighlightedLines(sections, 'addition', lang);
  var deletions = extractHighlightedLines(sections, 'deletion', lang);

  var additionIndex = 0;
  var deletionIndex = 0;

  return sections
    .map(function (section) {
      var type   = section.type;
      var lines  = section.lines;
      var length = lines.length;

      switch (type) {
        case 'addition':
          lines = additions.slice(additionIndex, additionIndex + length);
          additionIndex += length;
          break;

        case 'deletion':
        case null:
          lines = deletions.slice(deletionIndex, deletionIndex + length);
          deletionIndex += length;

          if (type === null) {
            additionIndex += length;
          }
          break;
      }

      var value = lines.join(SEPARATOR);

      return '<span class="diff-' + type + '">' + value + '</span>';
    })
    .join(SEPARATOR);
}

/**
 * Extract code from sections.
 *
 * @param  {Array}  sections
 * @param  {String} type
 * @param  {String} lang
 * @return {String}
 */
function extractHighlightedLines (sections, type, lang) {
  var str = sections
    .filter(function (section) {
      return section.type === null || section.type === type;
    })
    .map(function (section) {
      return section.lines.join(SEPARATOR);
    })
    .join(SEPARATOR);

  return highlight(str, lang).split(SEPARATOR);
}
