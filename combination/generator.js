const Promise = require("bluebird");

/*
 * children of the same branch on the word tree
 * should never be mixed together
 */
function CombinationGenerator(filters) {
    let generateCombinationsOfTwoWords = function (word1, word2) {
        let hyphenOrNothing = filters.separateByHyphen ? "-" : "";
        let combination1 = word1 + hyphenOrNothing + word2;
        let combination2 = word2 + hyphenOrNothing + word1;
        return [combination1, combination2];
    };

    let getVowelCount = function (strValue) {
        let vowel_list = 'aeiouAEIOU';
        let vcount = 0;
        let lastCharWasVowel = false;
        for (let x = 0; x < strValue.length; x++) {
            if (vowel_list.indexOf(strValue[x]) !== -1) {
                if (filters.hasOwnProperty("countConsecutiveVowelsAsSeparate") &&
                    filters.countConsecutiveVowelsAsSeparate === false) {
                    if (!lastCharWasVowel) {
                        vcount += 1;
                    }
                    lastCharWasVowel = true;
                } else {
                    vcount += 1;
                }
            } else {
                lastCharWasVowel = false;
            }
        }
        return vcount;
    };

    let filterCombinationsOfTwoWords = function (domains, word1, word2) {
        if (filters.ignore.indexOf(word1) === -1 && filters.ignore.indexOf(word2) === -1) {
            let rawCombinations = generateCombinationsOfTwoWords(word1, word2);
            if (getVowelCount(rawCombinations[0]) <= filters.maxVowels) {
                for (let rawKey in rawCombinations) {
                    if (rawCombinations.hasOwnProperty(rawKey)) {
                        let rawCombination = rawCombinations[rawKey].toLowerCase();
                        if (filters.hasOwnProperty("extensions") && filters.extensions.length > 0) {
                            for (let extensionKey in filters.extensions) {
                                if (filters.extensions.hasOwnProperty(extensionKey)) {
                                    let extension = filters.extensions[extensionKey];
                                    domains.add("www." + rawCombination + "." + extension)
                                }
                            }
                        } else {
                            //if no extensions are specified then we only look for ".com" extensions
                            domains.add("www." + rawCombination + ".com")
                        }
                    }
                }
            }
        }
    };

    let generateDomains = function (wordTree) {
        return new Promise((resolve, reject) => {
            let domains = new Set();
            for (let index1 in wordTree) {
                if (wordTree.hasOwnProperty(index1)) {
                    let branch1 = wordTree[index1];
                    for (let index2 in wordTree) {
                        // don't want to combine branches with themselves
                        if (index1 !== index2) {
                            if (wordTree.hasOwnProperty(index2)) {
                                let branch2 = wordTree[index2];
                                for (let i in branch1) {
                                    if (branch1.hasOwnProperty(i)) {
                                        let word1 = branch1[i];
                                        for (let j in branch2) {
                                            // don't want to have the same word from different branches
                                            if (i !== j) {
                                                if (branch2.hasOwnProperty(j)) {
                                                    let word2 = branch2[j];
                                                    filterCombinationsOfTwoWords(domains, word1, word2);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            resolve([...domains])
        })
    };

    return {
        generateCombinations: generateDomains
    };
}

module.exports = CombinationGenerator;