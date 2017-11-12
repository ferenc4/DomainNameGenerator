# Setup
You need to have npm and node js install.

Then to install all the node js dependencies, run
```
npm install
```

The thesaurus requires your own api key, for which the free tier is limited so you need to generate your own.
You can do this at 'https://words.bighugelabs.com/getkey.php' then you'll need to create a file as
```
external\keys.json
```

with the following contents
```
{
  "bighugelabs": "insertYourApiKeyHere"
}
```

To create the configurations we will be passing to the script, create
```
config\input.json
```

These are the sample contents for your input.json file
```
{
  "filters": {
    "maxVowels": 4,
    "countConsecutiveVowelsAsSeparate": true,
    "separateByHyphen":false,
    "extensions": [
      "com",
      "com.au",
      "io"
    ],
    "ignore": [
      "throng",
      "gloom",
      "maid",
      "maiden",
      "glumness"
    ]
  },
  "words": [
    "data",
    "cloud",
    "io"
  ],
  "report": "report.json"
}
```

# Usage
You can run the script using
```
node app
```
