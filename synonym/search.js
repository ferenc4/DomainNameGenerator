const bighugelabs = require('../external/list').bighugelabs;
const bighugelabsKey = require('../external/keys').bighugelabs;
const https = require('https');
const Promise = require("bluebird");
async function requestSynonyms(word) {
    let synonyms = [];
    // options for the GET request
    let options = {
        host: bighugelabs.endpoint.host, // only the domain name (no http/https)
        path: bighugelabs.endpoint.path + bighugelabsKey + "/" + word + "/json",
        method: 'GET'
    };
    return new Promise(
        (resolve, reject) => {
            let request = https.request(options, function (response) {
                if (response.statusCode !== 200) {
                    reject("Unexpected statusCode: ", response.statusCode, " for options: ", JSON.stringify(options))
                }
                response.on('data', function (data) {
                    let rawSynonyms = JSON.parse(data).noun.syn;
                    rawSynonyms.forEach(function (rawSynonym, index) {
                        // we want to remove all phrases
                        if (String(rawSynonym).indexOf(" ") === -1) {
                            synonyms.push(rawSynonym)
                        }
                        if (index === rawSynonyms.length - 1) {
                            resolve(synonyms)
                        }
                    })
                });
            });
            request.end();
        }
    );
}

module.exports = findSynonyms = async function (words) {
    const synonymTree = {};
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
            requestSynonyms(word)
                .then((synonyms) => {
                    synonymTree[word] = synonyms;
                    synonymTree[word].push(word);
                    console.log(synonymTree[word])
                });

            if (index === words.length - 1) {
                resolve(synonymTree)
            }
        })
    });
};