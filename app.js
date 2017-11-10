const Promise = require("bluebird");
const findSynonyms = require("./synonym/search");
const generateCombinations = require("./combination/generator");
const reportOnDomains = require("./domain/check");
const inputs = require("./config/input.json");
const promisedSynonymTree = findSynonyms(inputs.words);
promisedSynonymTree.then(function (wordTree) {
    return generateCombinations(wordTree, inputs.extensions)
}).then(function (domains) {
    return reportOnDomains(inputs.report, domains)
});