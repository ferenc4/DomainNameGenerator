const Promise = require("bluebird");
const findSynonyms = require("./synonym/search");
const generateCombinations = require("./combination/generator");
const reportOnDomains = require("./domain/check");
//inputs start
const words = ['data', 'cloud', 'hive'];
const domainExtensions = ['com', 'com.au', 'io'];
const report = "report.json";
const promisedSynonymTree = findSynonyms(words);
promisedSynonymTree.then(function (wordTree) {
    return generateCombinations(wordTree, domainExtensions)
}).then(function (domains) {
    return reportOnDomains(report, domains)
});