let dns = require('dns');
let fs = require('fs');

let checkAllDomains = function (domains, outputFile, whenCheckDomainsFinished) {
    let potentialWebsites = new Set();
    domains.forEach(function (domain, index) {
        dns.resolve4(domain, function (err, addresses) {
            if (err) {
                potentialWebsites.add(domain);
            }
            if (index === domains.length - 1) {
                whenCheckDomainsFinished(outputFile, JSON.stringify({
                    "domains": [...potentialWebsites]
                }, null, 2))
            }
        });
    });
};

saveReport = function (filename, data) {
    fs.writeFile(filename, data, 'utf8', (err) => {
        if (err) throw err;
        console.log("Saved list to " + filename)
    })
};

module.exports = reportOnDomains = function (filename, domains) {
    checkAllDomains(domains, filename, saveReport);
};