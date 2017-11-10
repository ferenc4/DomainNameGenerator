let dns = require('dns');
let fs = require('fs');

let checkAllDomains = function (domains, outputFile) {
    let potentialWebsites = new Set();
    let promisedResponses = [];
    domains.forEach(function (domain) {
        promisedResponses.push(new Promise((resolve, reject) => {
            dns.resolve4(domain, function (err, addresses) {
                let exists;
                if (err) {
                    if (err.hasOwnProperty('errno')) {
                        if (err.errno === 'ENOTFOUND') {
                            exists = false;
                        } else if (err.errno === 'ESERVFAIL') {
                            exists = true;
                        } else {
                            console.log(err);
                            exists = false;
                        }
                    }
                } else {
                    exists = true;
                }
                resolve({
                    "domain": domain,
                    "exists": exists
                });
            })
        }));
    });
    return Promise.all(promisedResponses)
        .then((responses) => {
            let reportObject = {
                "unused": [],
                "used": []
            };
            responses.forEach(function (response) {
                if (response.exists) {
                    reportObject.used.push(response.domain)
                } else {
                    reportObject.unused.push(response.domain)
                }
            });
            return reportObject
        })
};

saveReport = function (filename, data) {
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) throw err;
        else console.log("Saved list to " + filename)
    })
};

module.exports = reportOnDomains = function (filename, domains) {
    checkAllDomains(domains, filename)
        .then(function (reportObject) {
            reportObject.used.sort();
            reportObject.unused.sort();
            return reportObject;
        })
        .then(function (data) {
            saveReport(filename, data)
        });
};