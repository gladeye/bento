const { config } = require("webpack-kit");

module.exports = config({
    "entry": {
        "main": [
            "./scripts/main.js"
        ]
    },

    "input": "<%= input %>",

    "output": "<%= output %>",

    "publicPath": "<%= public %>",

    "hash": ".[hash:8]",

    "watch": [

    ],

    "browsers": [
        "last 1 version"
    ],

    "enabled": {
        "sourceMap": true
    },

    "copy": "+(images|media)/**/*",

    "proxy": <%- server ? ('"' + proxy + '"') : "false" %>

}, !!process.argv.indexOf('webpack-dev-server'));

