#! /usr/bin/env node
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import path from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const download = async function (url) {
  console.log(chalk.green('DOWNLOAD START'));
  new Promise(async (resolve, reject) => {
    const file = fs.createWriteStream(__dirname + '/plantuml.jar');
    console.log(chalk.blue('URL ' + url));
    const res = await fetch(url);
    console.log(chalk.blue('SAVING FILE'));
    res.body.pipe(file);
    res.body.on('error', reject);
    file.on('finish', () => {
      console.log(chalk.green('DOWNLOAD END'));
      resolve();
    });
  });
};

await download('https://github.com/plantuml/plantuml/releases/download/v1.2023.0/plantuml.jar');
