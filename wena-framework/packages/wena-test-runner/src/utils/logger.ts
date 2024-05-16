import chalk from 'chalk';
import logSymbols from 'log-symbols';

export default class Logger {

    static success(message: string) {
        console.log(logSymbols.success, chalk.green(`${message}`));
    }

    static info(message: string) {
        console.info(logSymbols.info, message);
    }

    static warning(message: string) {
        console.warn(logSymbols.warning, message);
    }

    static error(message: string) {
        console.log(logSymbols.error, chalk.red(`${message}`));
    }
}