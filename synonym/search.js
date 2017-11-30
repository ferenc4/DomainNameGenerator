const bighugelabs = require('../external/list').bighugelabs;
const bighugelabsKey = require('../external/keys').bighugelabs;
const https = require('https');
const Promise = require("bluebird");
function requestSynonyms(word) {
    let synonyms = [];
    // config for the GET request
    let options = {
        host: bighugelabs.endpoint.host, // only the domain name (no http/https)
        path: bighugelabs.endpoint.path + bighugelabsKey + "/" + word + "/json",
        method: 'GET'
    };
    return new Promise((resolve, reject) => {
        let request = https.request(options, function (response) {
            if (response.statusCode !== 200) {
                reject("Unexpected statusCode: ", response.statusCode, " for config: ", JSON.stringify(options))
            }
            response.on('data', function (data) {
                let noun = JSON.parse(data).noun;
                let rawSynonyms = [];
                if (noun !== undefined) {
                    rawSynonyms = noun.syn;
                }
                rawSynonyms.forEach(function (rawSynonym, index) {
                    // we want to remove all phrases
                    if (String(rawSynonym).indexOf(" ") === -1) {
                        synonyms.push(rawSynonym)
                    }
                    if (index === rawSynonyms.length - 1) {
                        resolve({"synonyms": synonyms, "word": word})
                    }
                })
            });
        });
        request.end();
    });
}

module.exports = findSynonyms = function (words) {
    let synonymTree = {};
    let promisedSynonyms = [];
    return new Promise((resolve, reject) => {
        words.forEach(function (word, index) {
            /*
             * initialise that word's array
             *
             * we want to keep synonymTree for different words separate,
             * because we don't want to mix a word's synonymTree with themselves
             *
             * we also want to add the word itself to its own synonymTree
             * so we can later use it as well for domain name generation
             *
             */
            promisedSynonyms.push(requestSynonyms(word))
        });
        Promise.all(promisedSynonyms)
            .then((promisedSynonyms) => {
                promisedSynonyms.forEach(function (synonymObject) {
                    synonymTree[synonymObject.word] = synonymObject.synonyms;
                    synonymTree[synonymObject.word].push(synonymObject.word);
                });
                resolve(synonymTree);
            });
    });
};