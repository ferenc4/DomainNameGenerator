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

# Usage
You can run the script using
```
node app
```
