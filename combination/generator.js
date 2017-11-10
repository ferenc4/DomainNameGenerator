const Promise = require("bluebird");

/*
 * children of the same branch on the word tree
 * should never be mixed together
 */
module.exports = generateCombinations = function (wordTree, extensions) {
    return new Promise((resolve, reject) => {
        let combinations = new Set();
        for (let extension in extensions) {
            if (extensions.hasOwnProperty(extension)) {
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
                                                        combinations.add("www." + word1 + word2 + "." + extensions[extension]);
                                                        combinations.add("www." + word2 + word1 + "." + extensions[extension]);
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
            }
        }
        resolve([...combinations])
    })
};