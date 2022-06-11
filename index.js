const fs = require('fs');
const prompt = require('prompt-sync')();
const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
colors.enable();

const version = '1.0.0';
const PORT = 3000;

const INFO = `${__dirname}/logs/info.txt`;
const RESULT = `${__dirname}/logs/result.txt`;
const TEMPLATES_JSON = `${__dirname}/template/templates.json`;

function banner() {
  const art = `
  __                        __                 
_/  |_____________    ____ |  | __ ___________ 
\\   __\\_  __ \\__  \\ _/ ___\\|  |/ // __ \\_  __ \\
 |  |  |  | \\// __ \\\\  \\___|    <\\  ___/|  | \\/
 |__|  |__|  (____  /\\___  >__|_ \\\\___  >__|   
                  \\/     \\/     \\/    \\/`
  console.log(art.green);
  console.log(`[>] `.green + `Author  : `.cyan +  `atkh6673`.white);
  console.log(`[>] `.green + `Version : `.cyan + version.white);
}

function clear() {
  fs.writeFile(RESULT, '', () => {});
  fs.writeFile(INFO, '', () => {});
}

function template_select(site) {
  console.log(`\n[!] Select a template:`.yellow);
  
  const templ_json = JSON.parse(fs.readFileSync(TEMPLATES_JSON, {
    encoding: 'ascii',
    flag: 'r'
  }));

  for (const item in templ_json['templates']) {
    const name = templ_json['templates'][item]['name'];
    console.log(`[${parseInt(item) + 1}] `.green + name.cyan);
  }

  var selected;
  try {
    selected = parseInt(prompt(`[>] `.green)) - 1;

    if (selected < 0) {
      throw `[-] Invalid input!`.red;
    }
  } 
  catch(err) {
    console.log(`[-] Invalid input!`.red);
  }

  try {
    site = templ_json['templates'][selected]['dir_name']
  }
  catch(err) {
    console.log(`[-] Invalid input!`.red);
  }

  console.log(`\n[+] `.green + `Loading `.cyan + templ_json['templates'][selected]['name'].yellow + ` template...`.cyan);

  return site
}

function server() {
  console.log();
  console.log(`[+] `.green + `Port : `.cyan + `${PORT}`.white);
  console.log(`[+] `.green + `Starting HTTP server...`.cyan);
  
  const server = express();

  server.use(bodyParser.urlencoded({
    extended: false
  }));

  server.get('/', (req, res) => {
    res.sendFile(`${__dirname}/template/${SITE}/index.html`);
  });
  
  server.listen(PORT, () => {
    console.log(`[+] `.green + `Server created`.cyan);
    console.log(`[+] `.green + `Listening on `.cyan + `127.0.0.1:${PORT}`.white);
  });
}

banner();
clear();
var SITE = template_select(SITE);
server();