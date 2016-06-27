var assert = require('should');
var fis_webpack = require('../');
var fs = require('fs');
var path = require('path');

var testdir = 'test/fixtures';
describe('fixtures', function () {
  var items = fs.readdirSync(testdir).filter(function (item) {
    return /([^.\\\/])\.input\.(\w+)$/i.test(item);
  });
  items.forEach(function (input) {
    input = path.join(testdir, input);
    var output = input.replace(/([^.\\\/])\.input\.(\w+)$/i, '$1.output.$2');
    var option = path.resolve(input.replace(/([^.\\\/])\.input\.(\w+)$/i, '$1.option.js'));

    function cleanCRLF(content) {
      return String(content).replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
        .replace(/^\uFEFF/, ''); // 数据清洗
    }

    var text_input = String(fs.readFileSync(input));
    var text_output = cleanCRLF(String(fs.readFileSync(output)));

    it(input, function () {
      assert.equal(
        text_output,
        fis_webpack(text_input, {
          origin: input,
          filename: path.basename(input),
          dirname: testdir,
          ext: path.basename(input)
        }, require(option))
      );
    });
  });
});
