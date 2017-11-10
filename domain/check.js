let dns = require('dns');
let fs = require('fs');

let checkAllDomains = function (domains, outputFile) {
    let potentialWebsites = new Set();
    let promisedResponses = [];
    domains.forEach(function (domain) {
        promisedResponses.push(new Promise((resolve, reject) => {
            dns.resolve4(domain, function (err, addresses) {
                resolve({
                    "domain": domain,
                    "exists": Boolean(err)
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
    fs.writeFile(filename, JSON.stringify(data), 'utf8', (err) => {
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