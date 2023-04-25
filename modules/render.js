import chalk from 'chalk';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function render(input) {
  console.log(chalk.magenta('RENDER') + ' PlantUML image');
  const timers = [
    setTimeout(() => console.log(chalk.magenta('RENDER') + ' this might take a while, please wait...'), 4000),
    setTimeout(() => console.log(chalk.magenta('RENDER') + ' still at work...'), 12000),
    setTimeout(() => console.log(chalk.magenta('RENDER') + ' sometimes it takes longer than a minute...'), 30000),
    setTimeout(() => console.log(chalk.magenta('RENDER') + ' normal to take this long sometimes...'), 90000),
  ];
  console.time(chalk.magenta('RENDER') + ' done');
  return new Promise((resolve, reject) => {
    exec(`java -DPLANTUML_LIMIT_SIZE=8192 -jar ${__dirname}\\..\\plantuml.jar ${input} -nometadata`, {}, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(error);
        console.error(stderr);
        reject(error);
      } else {
        console.timeEnd(chalk.magenta('RENDER') + ' done');
        resolve();
      }
      timers.forEach((t) => clearTimeout(t));
    });
  });
}
