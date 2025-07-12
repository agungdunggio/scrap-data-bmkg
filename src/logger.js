const chalk = require('chalk');
const ora = require('ora');

let spinner = null; 

const log = {
  start: (text) => {
    if (spinner) {
      spinner.stop();
    }
    spinner = ora({
      text: chalk.cyan.bold(`[PROCESS] ${text}`),
      spinner: 'dots' // Anda bisa ganti dengan 'earth', 'moon', 'line', dll.
    }).start();
  },

  succeed: (text) => {
    if (spinner) {
      spinner.succeed(chalk.green(`[SUCCESS] ${text}`));
      spinner = null;
    }
  },

  fail: (text) => {
    if (spinner) {
      spinner.fail(chalk.red(`[FAIL]    ${text}`));
      spinner = null;
    }
  },

  update: (text) => {
    if (spinner) {
      spinner.text = chalk.cyan.bold(`[PROCESS] ${text}`);
    }
  },

  info: (message) => {
    if (spinner) {
      spinner.stopAndPersist({
        symbol: chalk.blue('ℹ'),
        text: chalk.blue(`[INFO]   ${message}`),
      });
    } else {
      console.log(chalk.blue(`[INFO]   ${message}`));
    }
  },
  
  warn: (message) => {
    if (spinner) {
      spinner.stopAndPersist({
        symbol: chalk.yellow('⚠️'),
        text: chalk.yellow(`[WARN]    ${message}`),
      });
    } else {
      console.log(chalk.yellow(`[WARN]    ${message}`));
    }
  },
  
  header: (message) => console.log(chalk.magenta.bold(`\n[HEADER] ${message}`)),
  error: (message, errorObj = '') => console.error(chalk.red.bold(`[ERROR]   ${message}`), errorObj),
  divider: () => console.log(chalk.gray('--------------------------------------------')),
};

module.exports = log;