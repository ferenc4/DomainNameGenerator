const Promise = require("bluebird");
const findSynonyms = require("./synonym/search.js");
const words = ['data', 'cloud', 'hive'];
const synonymTreeP = findSynonyms(words);
synonymTreeP.then(function (wordTree) {
    const generateCombinations = require("./combination/generator.js");
    generateCombinations(wordTree)
});
const reportOnDomains = require("./domain/check");
const report = "report.json";
// reportOnDomains(report, domains);