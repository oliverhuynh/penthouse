#!/usr/bin/env node

const penthouse = require('../lib/index.js');
const fs = require('fs');
const yargs = require('yargs');

yargs
  .option('url', {
    describe: 'Accessible URL. Use file:/// protocol for local HTML files.',
    type: 'string',
    demandOption: true
  })
  .option('cssString', {
    describe: 'Original CSS to extract critical CSS from.',
    type: 'string'
  })
  .option('css', {
    describe: 'Path to original CSS file on disk (if using instead of cssString).',
    type: 'string'
  })
  .option('width', {
    describe: 'Width for critical viewport.',
    type: 'number',
    default: 1300
  })
  .option('height', {
    describe: 'Height for critical viewport.',
    type: 'number',
    default: 900
  })
  .option('screenshots', {
    describe: 'Configuration for screenshots (not used by default).',
    type: 'object'
  })
  .option('keepLargerMediaQueries', {
    describe: 'Keep media queries even for width/height values larger than critical viewport.',
    type: 'boolean',
    default: false
  })
  .option('forceInclude', {
    describe: 'Array of CSS selectors to keep in critical CSS, even if not appearing in critical viewport.',
    type: 'array',
    default: []
  })
  .option('forceExclude', {
    describe: 'Array of CSS selectors to remove in critical CSS, even if appearing in critical viewport.',
    type: 'array',
    default: []
  })
  .option('forceExclude', {
    describe: 'Array of CSS selectors to remove in critical CSS, even if appearing in critical viewport.',
    type: 'array',
    default: []
  })
  .option('propertiesToRemove', {
    describe: 'Css properties to filter out from critical css.',
    type: 'array',
    default: ['(.*)transition(.*)', 'cursor', 'pointer-events', '(-webkit-)?tap-highlight-color', '(.*)user-select']
  })
  .option('timeout', {
    describe: 'Ms; abort critical CSS generation after this time.',
    type: 'number',
    default: 30000
  })
  .option('puppeteer', {
    describe: 'Settings for puppeteer. See Custom puppeteer browser example.',
    type: 'object'
  })
  .option('pageLoadSkipTimeout', {
    describe: 'Ms; stop waiting for page load after this time (for sites when page load event is unreliable).',
    type: 'number',
    default: 0
  })
  .option('renderWaitTime', {
    describe: 'Ms; wait time after page load before critical css extraction starts.',
    type: 'number',
    default: 100
  })
  .option('blockJSRequests', {
    describe: 'Set to false to load JS (not recommended).',
    type: 'boolean',
    default: true
  })
  .option('maxEmbeddedBase64Length', {
    describe: 'Characters; strip out inline base64 encoded resources larger than this.',
    type: 'number',
    default: 1000
  })
  .option('maxElementsToCheckPerSelector', {
    describe: 'Can be specified to limit number of elements to inspect per CSS selector, reducing execution time.',
    type: 'number',
    default: undefined
  })
  .option('userAgent', {
    describe: 'Specify which user agent string when loading the page.',
    type: 'string',
    default: 'Penthouse Critical Path CSS Generator'
  })
  .option('customPageHeaders', {
    describe: 'Set extra HTTP headers to be sent with the request for the url.',
    type: 'object'
  })
  .option('cookies', {
    describe: 'For formatting of each cookie, see Puppeteer setCookie docs.',
    type: 'array',
    default: []
  })
  .option('strict', {
    describe: 'Make Penthouse throw on errors parsing the original CSS. Legacy option, not recommended.',
    type: 'boolean',
    default: false
  })
  .option('allowedResponseCode', {
    describe: 'Let Penthouse stop if the server response code is not matching this value.',
    type: 'number | regex | function',
    default: undefined
  })
  .argv;

const options = yargs.argv;

if (!options.url || !(options.cssString || options.css)) {
  console.error('Usage: node index.js --url <url> --cssString <cssString> [--width <width>] [--height <height] [--css <path_to_file>] [--screenshots <object>] [--keepLargerMediaQueries <boolean>] [--forceInclude <array>] [--forceExclude <array>] [--propertiesToRemove <array>] [--timeout <ms>] [--puppeteer <object>]');
  process.exit(1);
}

penthouse(options)
  .then(criticalCss => {
    console.log(criticalCss);
  })
  .catch(err => {
    console.error('Error generating critical CSS:', err);
  });
