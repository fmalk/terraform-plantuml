#! /usr/bin/env node

import request from 'request';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const download = async function (url) {
  const file = fs.createWriteStream(__dirname + '/plantuml.jar');
  return new Promise((resolve, reject) => {
    request(url).pipe(file).on('close', resolve);
  });
};

await download('https://github.com/plantuml/plantuml/releases/download/v1.2023.0/plantuml.jar');
