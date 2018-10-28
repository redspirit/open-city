
let config, configName;
const argv = require('minimist')(process.argv.slice(2));

if(argv.dev) {
    configName = 'dev.json';
} else {
    configName = 'release.json';
}

config = require('./../configs/' + configName);
console.log("Use config:", configName);


// decorate config

if(argv.port) {
    console.log("Use port:", argv.port);
    config.http.port = argv.port;
}

module.exports = config;