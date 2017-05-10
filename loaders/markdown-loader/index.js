const { md } = require('../../utils/render');

module.exports = function(content) {
  const result = md(content);

  this.cacheable();
  this.value = result;

  return `module.exports = ${JSON.stringify(result)}`;
};
